// dashboard/payment.js

document.getElementById('paymentForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  // بيانات البطاقة شكلية، مفيش تحقق حقيقي
  const cardNumber = document.getElementById('cardNumber').value.trim();
  const cardHolder = document.getElementById('cardHolder').value.trim();
  const expiry = document.getElementById('expiry').value.trim();
  const cvv = document.getElementById('cvv').value.trim();

  if (!cardNumber || !cardHolder || !expiry || !cvv) {
    alert("Please fill in all fields.");
    return;
  }

  // ✅ جلب البيانات
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder'));

  if (!currentUser || !pendingOrder || pendingOrder.length === 0) {
    alert("Something went wrong. Try again.");
    return;
  }

  // إنشاء الطلب
  const newOrder = {
    userId: currentUser.id,
    username: currentUser.username,
    items: pendingOrder,
    total: pendingOrder.reduce((sum, item) => sum + Number(item.price), 0),
    date: new Date().toISOString(),
    status: "pending"
  };

  // ✅ إرسال الطلب إلى db.json (json-server)
  await fetch('http://localhost:3000/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newOrder)
  });

  // تنظيف البيانات من localStorage
  localStorage.removeItem('pendingOrder');
  localStorage.removeItem('cart');

  // توجيه المستخدم لصفحة الشكر
  window.location.href = 'thank.html';
});
