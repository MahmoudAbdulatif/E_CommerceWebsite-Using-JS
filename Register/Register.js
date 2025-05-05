const form = document.getElementById("registerForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = "customer"; // ثابت لأي مستخدم بيسجل

  // ✅ التأكد من أن اسم المستخدم غير مكرر
  const res = await fetch(`http://localhost:3000/users?username=${username}`);
  const data = await res.json();

  if (data.length > 0) {
    alert("Username already exists!");
    return;
  }

  // 🔥 توليد ID جديد يدويًا لضمان عدم حدوث مشاكل عند التعديل لاحقًا
  const usersRes = await fetch("http://localhost:3000/users");
  const users = await usersRes.json();
  const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

  // ✅ إنشاء المستخدم الجديد
  const newUser = {
    id: newId,
    username,
    password,
    role
  };

  // ✅ إرسال البيانات إلى قاعدة البيانات
  const createRes = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser)
  });

  if (createRes.ok) {
    alert("Registration successful!");
    window.location.href = "login.html"; // توجيه المستخدم لصفحة تسجيل الدخول
  } else {
    alert("حدث خطأ أثناء التسجيل. حاول مرة أخرى!");
  }
});
