const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "admin") {
  alert("Unauthorized Access!");
  window.location.href = "../Login/login.html";
}

const productList = document.getElementById("productList");
const editModal = document.getElementById("editModal");
const editProductForm = document.getElementById("editProductForm");
const closeModal = document.getElementById("closeModal");

async function fetchAllProducts() {
  try {
    const res = await fetch("http://localhost:3000/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    const products = await res.json();

    productList.innerHTML = "";

    products.forEach((product) => {
      if (isNaN(product.id)) {
        console.warn(`Invalid product ID: ${product.id}. Expected a number.`);
        return;
      }

      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.innerHTML = `
        <img src="${product.image || '../img/products/f1.jpg'}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p><strong>Brand:</strong> <em>${product.brand || 'No brand'}</em></p>
        <p><strong>Price:</strong> ${product.price} EGP</p>
        <p><strong>Status:</strong> ${product.status}</p>
        <div class="button-group">
          <button class="btn btn-edit" onclick="openEditModal(${product.id}, '${product.name}', ${product.price}, '${product.status}', '${product.image || ''}')"><i class="fas fa-edit"></i> Edit</button>
          <button class="btn btn-delete" onclick="deleteProduct(${product.id})"><i class="fas fa-trash"></i> Delete</button>
        </div>
      `;
      productList.appendChild(productCard);
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    productList.innerHTML = `<p>Error loading products. Please try again later.</p>`;
  }
}

async function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      await fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE",
      });
      fetchAllProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  }
}

function openEditModal(id, name, price, status, image) {
  document.getElementById("editProductId").value = id;
  document.getElementById("editName").value = name;
  document.getElementById("editPrice").value = price;
  document.getElementById("editStatus").value = status;
  document.getElementById("editImage").value = image;
  editModal.style.display = "block";
}

editProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editProductId").value;
  const name = document.getElementById("editName").value.trim();
  const price = parseFloat(document.getElementById("editPrice").value);
  const status = document.getElementById("editStatus").value;
  const image = document.getElementById("editImage").value.trim();

  if (!name || isNaN(price) || !status) {
    alert("Please fill all required fields correctly.");
    return;
  }

  try {
    await fetch(`http://localhost:3000/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, status, image: image || undefined }),
    });
    editModal.style.display = "none";
    fetchAllProducts();
  } catch (error) {
    console.error("Error updating product:", error);
    alert("Failed to update product. Please try again.");
  }
});

closeModal.addEventListener("click", () => {
  editModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === editModal) {
    editModal.style.display = "none";
  }
});

fetchAllProducts();