const productList = document.getElementById("productList");

// نحصل على المستخدم الحالي من localStorage
const currentSeller = JSON.parse(localStorage.getItem("currentUser"));

// تحقق إن المستخدم فعلاً بائع
if (!currentSeller || currentSeller.role !== "seller") {
  alert("You must be a seller to access this page.");
  window.location.href = "login.html";
}

// عرض المنتجات الخاصة بالبائع
async function fetchSellerProducts() {
  const res = await fetch("http://localhost:3000/products");
  const allProducts = await res.json();

  const sellerProducts = allProducts.filter(p => p.sellerId === currentSeller.id);

  productList.innerHTML = "";

  sellerProducts.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <h3>${product.name}</h3>
      <p>Price: ${product.price} Pound</p>
      <p>Category: ${product.category}</p>
      <p>Status: <strong>${product.status}</strong></p>

      <div style="margin-top:10px">
        <input type="text" id="edit-name-${product.id}" value="${product.name}" placeholder="NameOfProduct " />
        <input type="number" id="edit-price-${product.id}" value="${product.price}" placeholder="Price" />
        <input type="text" id="edit-category-${product.id}" value="${product.category}" placeholder="Category" />

        <div class="actions">
          <button onclick="updateProduct(${product.id})">✏️ Edit</button>
          <button onclick="deleteProduct(${product.id})">🗑️ Remove</button>
        </div>
      </div>
    `;

    productList.appendChild(card);
  });
}

// إضافة منتج جديد
window.addProduct = async function () {
  const name = document.getElementById("new-name").value.trim();
  const price = parseFloat(document.getElementById("new-price").value);
  const category = document.getElementById("new-category").value.trim();

  if (!name || !price || !category) {
    alert("من فضلك املأ جميع الحقول.");
    return;
  }

  const newProduct = {
    name,
    price,
    category,
    status: "pending", // الحالة مبدئيًا انتظار موافقة الأدمن
    sellerId: currentSeller.id
    // ❌ لا ترسل id — json-server يولدها تلقائيًا
  };

  await fetch("http://localhost:3000/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct)
  });

  // إعادة تحميل المنتجات
  fetchSellerProducts();

  // تفريغ الحقول
  document.getElementById("new-name").value = "";
  document.getElementById("new-price").value = "";
  document.getElementById("new-category").value = "";
};

// تعديل منتج
window.updateProduct = async function (id) {
  const name = document.getElementById(`edit-name-${id}`).value.trim();
  const price = parseFloat(document.getElementById(`edit-price-${id}`).value);
  const category = document.getElementById(`edit-category-${id}`).value.trim();

  if (!name || !price || !category) {
    alert("Please fill in all fields.");
    return;
  }

  await fetch(`http://localhost:3000/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, category })
  });

  fetchSellerProducts();
};

// حذف منتج
window.deleteProduct = async function (id) {
  if (confirm("Are you sure you want to delete this product?")) {
    await fetch(`http://localhost:3000/products/${id}`, {
      method: "DELETE"
    });

    fetchSellerProducts();
  }
};

// تحميل المنتجات أول ما الصفحة تفتح
fetchSellerProducts();
