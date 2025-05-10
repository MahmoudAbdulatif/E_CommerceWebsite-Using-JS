const productList = document.getElementById("productList");
const currentSeller = JSON.parse(localStorage.getItem("currentUser"));

if (!currentSeller || currentSeller.role !== "seller") {
  alert("be seller first");
  window.location.href = "login.html";
}

async function fetchSellerProducts() {
  try {
    const res = await fetch("http://localhost:3000/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    const allProducts = await res.json();

    const sellerProducts = allProducts.filter(p => p.sellerId === currentSeller.id);

    productList.innerHTML = "";

    sellerProducts.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${product.image || 'https://via.placeholder.com/150'}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>السعر: ${product.price} Egy</p>
        <p>الفئة: ${product.category}</p>
        <p>الحالة: <strong>${product.status}</strong></p>

        <div>
          <input type="text" id="edit-name-${product.id}" value="${product.name}" placeholder="Name of product">
          <input type="number" id="edit-price-${product.id}" value="${product.price}" placeholder="Price">
          <input type="text" id="edit-category-${product.id}" value="${product.category}" placeholder="Category">
          <input type="file" id="edit-image-${product.id}" accept="image/*">
          <div class="actions">
            <button onclick="updateProduct(${product.id})">✏️ Edit</button>
            <button onclick="deleteProduct(${product.id})">🗑️ Delete</button>
          </div>
        </div>
      `;

      productList.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    productList.innerHTML = `<p>error</p>`;
  }
}

window.addProduct = async function () {
  const name = document.getElementById("new-name").value.trim();
  const price = parseFloat(document.getElementById("new-price").value);
  const category = document.getElementById("new-category").value.trim();
  const imageInput = document.getElementById("new-image");
  const imageFile = imageInput.files[0];

  if (!name || !price || !category) {
    alert("please fill all required fields correctly.");
    return;
  }

  const newProduct = {
    name,
    price,
    category,
    status: "pending",
    sellerId: currentSeller.id,
    image: imageFile ? await convertToBase64(imageFile) : "https://via.placeholder.com/150"
  };

  try {
    await fetch("http://localhost:3000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct)
    });

    fetchSellerProducts();
    document.getElementById("new-name").value = "";
    document.getElementById("new-price").value = "";
    document.getElementById("new-category").value = "";
    imageInput.value = "";
    alert("done"); 
  } catch (error) {
    console.error("Error adding product:", error);
    alert("error");
  }
};

window.updateProduct = async function (id) {
  const name = document.getElementById(`edit-name-${id}`).value.trim();
  const price = parseFloat(document.getElementById(`edit-price-${id}`).value);
  const category = document.getElementById(`edit-category-${id}`).value.trim();
  const imageInput = document.getElementById(`edit-image-${id}`);
  const imageFile = imageInput.files[0];

  if (!name || !price || !category) {
    alert("please fill all required fields correctly.");
    return;
  }

  const updatedProduct = {
    name,
    price,
    category
  };

  if (imageFile) {
    updatedProduct.image = await convertToBase64(imageFile);
  }

  try {
    await fetch(`http://localhost:3000/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct)
    });

    fetchSellerProducts();
    alert("done");
  } catch (error) {
    console.error("Error updating product:", error);
    alert("error");
  }
};

window.deleteProduct = async function (id) {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      await fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE"
      });

      fetchSellerProducts();
      alert("its deleted");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product. Please try again.");
    }
  }
};

async function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

fetchSellerProducts();