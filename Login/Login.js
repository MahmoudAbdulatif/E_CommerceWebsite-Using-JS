// login.js

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  const res = await fetch(`http://localhost:3000/users?username=${username}&password=${password}`);
  const data = await res.json();

  if (data.length === 0) {
    alert("Invalid credentials!");
    return;
  }

  const user = data[0];

  // حفظ المستخدم في localStorage
  localStorage.setItem('currentUser', JSON.stringify(user));

  // توجيه حسب الدور
  if (user.role === 'admin') {
    window.location.href = '../Dashboard/admin.html';
  } else if (user.role === 'seller') {
    window.location.href = '../Dashboard/seller.html';
  } else if (user.role === 'customer') {
    window.location.href = '../Dashboard/customer.html';
  } else {
    alert("Unknown role");
  }
});
