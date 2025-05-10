// التحقق من صلاحية المستخدم
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "seller") {
  alert("Unauthorized!");
  window.location.href = "../Login/login.html";
}

// الوصول إلى النموذج وقائمة المنتجات
const form = document.getElementById("addProductForm");
const myProducts = document.getElementById("myProducts");

// إضافة منتج جديد
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // جمع بيانات المنتج
  const product = {
    name: document.getElementById("name").value,
    price: +document.getElementById("price").value,
    category: document.getElementById("category").value,
    brand: document.getElementById("brand").value || "N/A",
    image: document.getElementById("image").value, // مسار الصورة
    description: document.getElementById("description").value,
    status: "pending",
    sellerId: currentUser.id
  };

  console.log("Sending product:", product); // تسجيل البيانات المرسلة

  try {
    const response = await fetch("http://localhost:3000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });

    if (response.ok) {
      alert("Product submitted for review!");
      form.reset();
      loadMyProducts();
    } else {
      const errorText = await response.text();
      console.error("Server Response:", response.status, errorText);
      alert(`Error submitting product: ${errorText || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Fetch Error:", error.message);
    alert(`Failed to submit product: ${error.message}`);
  }
});

// تحميل وعرض منتجات البائع
async function loadMyProducts() {
  try {
    const res = await fetch("http://localhost:3000/products?sellerId=" + currentUser.id);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const products = await res.json();

    myProducts.innerHTML = ``;
    products.forEach(product => {
      myProducts.innerHTML += `
        <div>
          <img src="../${product.image}" alt="${product.name}">
          <strong>${product.name}</strong>
          <p>${product.price} EGP</p>
          <p>Category: ${product.category}</p>
          <p>Brand: ${product.brand}</p>
          <p>Status: ${product.status}</p>
          <p>Description: ${product.description}</p>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error loading products:", error.message);
    myProducts.innerHTML = `<p>Error loading products: ${error.message}</p>`;
  }
}

loadMyProducts();