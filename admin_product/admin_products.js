const productList = document.getElementById("productList");

async function fetchProducts() {
  const res = await fetch("http://localhost:3000/products");
  const products = await res.json();

  productList.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <h3>${product.name}</h3>
      <p>Price: ${product.price} Pound</p>
      <p>Category: ${product.category}</p>
      <p>Status: <strong>${product.status}</strong></p>
      <div class="actions">
        <button onclick="approveProduct(${product.id})">✔️ Agree</button>
        <button onclick="rejectProduct(${product.id})">❌ Refuse</button>
        <button onclick="deleteProduct(${product.id})">🗑️ Remove</button>
        <button onclick="editProduct(${product.id})">📝 Edit</button>
      </div>
      <div id="edit-form-${product.id}" style="display: none; margin-top: 10px;">
        <input type="text" id="name-${product.id}" value="${product.name}" placeholder="NameOfProduct" />
        <input type="number" id="price-${product.id}" value="${product.price}" placeholder="Price" />
        <input type="text" id="category-${product.id}" value="${product.category}" placeholder="Category" />
        <button onclick="saveProduct(${product.id})">💾 Save</button>
        <button onclick="cancelEdit(${product.id})">❌ Cancel</button>
      </div>
    `;

    productList.appendChild(card);
  });
}

window.approveProduct = async function(id) {
  await fetch(`http://localhost:3000/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "approved" })
  });
  fetchProducts();
};

window.rejectProduct = async function(id) {
  await fetch(`http://localhost:3000/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "rejected" })
  });
  fetchProducts();
};

window.deleteProduct = async function(id) {
  await fetch(`http://localhost:3000/products/${id}`, {
    method: "DELETE"
  });
  fetchProducts();
};

window.editProduct = function(id) {
  document.getElementById(`edit-form-${id}`).style.display = "block";
};

window.cancelEdit = function(id) {
  document.getElementById(`edit-form-${id}`).style.display = "none";
};

window.saveProduct = async function(id) {
  const name = document.getElementById(`name-${id}`).value.trim();
  const price = parseFloat(document.getElementById(`price-${id}`).value);
  const category = document.getElementById(`category-${id}`).value.trim();

  await fetch(`http://localhost:3000/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, category })
  });

  fetchProducts();
};

// تحميل البيانات أول ما الصفحة تفتح
fetchProducts();
