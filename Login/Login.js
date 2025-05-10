const form = document.getElementById('loginForm');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Check for user
  const res = await fetch(`http://localhost:3000/users?username=${username}&password=${password}`);
  const data = await res.json();

  if (data.length === 0) {
    alert("Invalid username or password.");
    return;
  }

  const user = data[0];
  localStorage.setItem("currentUser", JSON.stringify(user));

  // Redirect based on user role
  switch (user.role) {
    case "admin":
      window.location.href = "../Dashboard/admin.html";
      break;
    case "seller":
      window.location.href = "../Dashboard/seller.html";
      break;
    case "customer":
      window.location.href = "../index.html";
      break;
    default:
      alert("Something went wrong. Try again.");
      break;
  }
});