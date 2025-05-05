// تحقق من أن المستخدم أدمن
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser || currentUser.role !== 'admin') {
  alert("ليس لديك صلاحيات للوصول إلى هذه الصفحة.");
  window.location.href = '../auth/login.html';
}

const productList = document.getElementById('productList');

// جلب جميع المنتجات
async function fetchProducts() {
  const res = await fetch('http://localhost:3000/products');
  const products = await res.json();

  productList.innerHTML = `<h3>المنتجات المعلقة</h3>`;

  products.forEach(product => {
    if (product.status === 'pending') { // فقط المنتجات التي في حالة "معلق"
      productList.innerHTML += `
        <div style="margin-bottom: 10px; border: 1px solid #ccc; padding: 10px;">
          <strong>${product.name}</strong> - ${product.price} جنيه
          <p>التصنيف: ${product.category}</p>
          <p>الحالة: <em>${product.status}</em></p>
          <button onclick="approveProduct(${product.id})">✅ قبول</button>
          <button onclick="rejectProduct(${product.id})">❌ رفض</button>
        </div>
      `;
    }
  });
}

// إضافة منتج جديد
async function addProduct() {
  const newProduct = {
    name: "منتج جديد",
    price: 100,
    category: "إلكترونيات",
    status: "pending",
    id: await getNextId()  // هتستخدم دالة عشان تجيب id جديد
  };

  // إرسال المنتج إلى JSON Server
  await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct)
  });
  fetchProducts(); // إعادة تحميل المنتجات
}

// دالة لحساب الـ id الجديد
async function getNextId() {
  const res = await fetch('http://localhost:3000/products');
  const products = await res.json();
  
  // لو مفيش منتجات، يبقى الـ id هيكون 1
  if (products.length === 0) {
    return 1;
  }
  
  // حساب أكبر id حالي و إضافة 1 عليه
  const maxId = Math.max(...products.map(product => product.id));
  return maxId + 1;
}

// الموافقة على المنتج
async function approveProduct(id) {
  await fetch(`http://localhost:3000/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'approved' })
  });
  fetchProducts(); // إعادة تحميل المنتجات
}

// رفض المنتج
async function rejectProduct(id) {
  await fetch(`http://localhost:3000/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'rejected' })
  });
  fetchProducts(); // إعادة تحميل المنتجات
}

// تحميل المنتجات عند فتح الصفحة
fetchProducts();
