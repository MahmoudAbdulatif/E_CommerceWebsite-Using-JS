const body = document.querySelector("body"),
  nav = document.querySelector("nav"),
  modeToggle = document.querySelector(".dark-light"),
  searchToggle = document.querySelector(".searchToggle"),
  sidebarOpen = document.querySelector(".sidebarOpen"),
  siderbarClose = document.querySelector(".siderbarClose");
let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark-mode") {
  body.classList.add("dark");
}
// js code to toggle dark and light mode
modeToggle.addEventListener("click", () => {
  modeToggle.classList.toggle("active");
  body.classList.toggle("dark");
  // js code to keep user selected mode even page refresh or file reopen
  if (!body.classList.contains("dark")) {
    localStorage.setItem("mode", "light-mode");
  } else {
    localStorage.setItem("mode", "dark-mode");
  }
});
// js code to toggle search box
searchToggle.addEventListener("click", () => {
  searchToggle.classList.toggle("active");
});

//   js code to toggle sidebar
sidebarOpen.addEventListener("click", () => {
  nav.classList.add("active");
});
body.addEventListener("click", (e) => {
  let clickedElm = e.target;
  if (
    !clickedElm.classList.contains("sidebarOpen") &&
    !clickedElm.classList.contains("menu")
  ) {
    nav.classList.remove("active");
  }
});

// products.js

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// تحقق من تسجيل الدخول
if (
  !currentUser ||
  (currentUser.role !== "customer" &&
    currentUser.role !== "admin" &&
    currentUser.role !== "seller")
) {
  alert("يجب تسجيل الدخول كعميل لرؤية المنتجات");
  window.location.href = "../Login/login.html";
}

const productList = document.getElementById("productList");
let allProducts = []; // لتخزين كل المنتجات من الـ API

async function fetchProducts() {
  try {
    const res = await fetch("http://localhost:3000/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();

    // المنتجات الموافق عليها فقط
    allProducts = data.filter((p) => p.status === "approved");
    displayProducts(allProducts); // عرض المنتجات لأول مرة
  } catch (error) {
    console.error("Error fetching products:", error);
    productList.innerHTML = `<p>Error loading products. Please try again later.</p>`;
  }
}

function displayProducts(products) {
  productList.innerHTML = "";

  if (products.length === 0) {
    productList.innerHTML = `<p>No products found.</p>`;
    return;
  }

  products.forEach((product) => {
    productList.innerHTML += `
      <div class="pro">
        <a href="About/about.html?id=${product.id}">
          <img src="${
            `../${product.image}` || "../img/products/f1.jpg"
          }" alt="${product.name}" />
        </a>
        <div class="des">
          <span>${product.brand || "Brand"}</span>
          <h5>
            <a href="About/about.html?id=${
              product.id
            }" style="text-decoration: none; color: inherit;">
              ${product.name}
            </a>
          </h5>
          <div class="star" id="starz">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
          </div>
          <h4>${product.price} EGP</h4>
        </div>
        <a href="#" onclick="addToCart(${
          product.id
        })"><i class="fa-solid fa-cart-arrow-down cart"></i></a>
      </div>
    `;
  });
}

// إضافة للسلة
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ productId: String(productId), quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Done to Cart 🛒");
}

// وظيفة البحث
const searchInput = document.querySelector(".search-field input");
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm) ||
    (product.brand && product.brand.toLowerCase().includes(searchTerm))
  );
  displayProducts(filteredProducts);
});

fetchProducts();