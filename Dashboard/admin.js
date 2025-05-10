const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "admin") {
  alert("Unauthorized Access!");
  window.location.href = "../Login/login.html";
}

const productContainer = document.getElementById("productContainer");

async function loadProducts() {
  const res = await fetch("http://localhost:3000/products");
  const products = await res.json();

  productContainer.innerHTML = "";

  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <img src="../${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p><strong>Price:</strong> ${product.price} EGP</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Brand:</strong> ${product.brand}</p>
      <p><strong>Description:</strong> ${product.description}</p>
      <p><strong>Status:</strong> ${product.status}</p>
      <p><strong>Seller ID:</strong> ${product.sellerId}</p>
      <div class="button-group">
        <button class="btn btn-approve" onclick="approveProduct(${product.id})"><i class="fas fa-check"></i> Approve</button>
        <button class="btn btn-reject" onclick="rejectProduct(${product.id})"><i class="fas fa-times"></i> Reject</button>
      </div>
    `;
    productContainer.appendChild(productCard);
  });
}

async function approveProduct(id) {
  await fetch(`http://localhost:3000/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "approved" })
  });
  alert("Product Approved ✅");
  loadProducts();
}

async function rejectProduct(id) {
  await fetch(`http://localhost:3000/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "rejected" })
  });
  alert("Product Rejected ❌");
  loadProducts();
}

loadProducts();