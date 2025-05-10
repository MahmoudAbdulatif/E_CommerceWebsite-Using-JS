const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "admin") {
  alert("Unauthorized Access!");
  window.location.href = "../Login/login.html";
}

const form = document.getElementById("createUserForm");
const userList = document.getElementById("userList");
const editModal = document.getElementById("editModal");
const editUserForm = document.getElementById("editUserForm");
const closeModal = document.getElementById("closeModal");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  // Check if username already exists
  const res = await fetch(`http://localhost:3000/users?username=${username}`);
  const data = await res.json();
  if (data.length > 0) {
    alert("Username already exists!");
    return;
  }

  const user = { username, password, role };

  await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  alert("User created successfully!");
  form.reset();
  fetchUsers();
});

async function fetchUsers() {
  const res = await fetch("http://localhost:3000/users");
  const users = await res.json();

  userList.innerHTML = "";

  users.forEach((user) => {
    
    if (isNaN(user.id)) {
      console.error(`Invalid user ID: ${user.id}. Expected a number.`);
      return;
    }

    const userCard = document.createElement("div");
    userCard.className = "user-card";
    userCard.innerHTML = `
      <p><strong>Username:</strong> ${user.username}</p>
      <p><strong>Role:</strong> <em>${user.role}</em></p>
      <div class="button-group">
        <button class="btn btn-delete" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i> Delete</button>
        <button class="btn btn-edit" onclick="openEditModal(${user.id}, '${user.username}', '${user.role}')"><i class="fas fa-edit"></i> Edit</button>
      </div>
    `;
    userList.appendChild(userCard);
  });
}

async function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    await fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
    });
    fetchUsers();
  }
}

function openEditModal(id, username, role) {
  document.getElementById("editUserId").value = id;
  document.getElementById("editUsername").value = username;
  document.getElementById("editRole").value = role;
  editModal.style.display = "block";
}

editUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editUserId").value;
  const username = document.getElementById("editUsername").value.trim();
  const role = document.getElementById("editRole").value;

  if (username && role) {
    await fetch(`http://localhost:3000/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, role }),
    });
    editModal.style.display = "none";
    fetchUsers();
  }
});

closeModal.addEventListener("click", () => {
  editModal.style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === editModal) {
    editModal.style.display = "none";
  }
});

fetchUsers();