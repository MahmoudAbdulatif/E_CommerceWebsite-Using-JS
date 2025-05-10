// register.js
const form = document.getElementById("registerForm");
const errorMessage = document.getElementById("error-message");

function validateUsername(username) {
  const re = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
  return re.test(username);
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = "customer";

  if (!validateUsername(username)) {
    errorMessage.textContent = "username must start with a letter, contain only letters, numbers, and _ characters, and be between 3 and 16 characters";
    return;
  }

  const res = await fetch(`http://localhost:3000/users?username=${username}`);
  const data = await res.json();

  if (data.length > 0) {
    errorMessage.textContent = "username already exists";
    return;
  }

  const usersRes = await fetch("http://localhost:3000/users");
  const users = await usersRes.json();
  const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

  const newUser = {
    id: newId,
    username,
    password,
    role
  };

  const createRes = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser)
  });

  if (createRes.ok) {
    alert("success");
    window.location.href = "login.html";
  } else {
    errorMessage.textContent = "error in creating user";
  }
});
