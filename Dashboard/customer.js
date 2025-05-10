// dashboard/customer.js

const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || currentUser.role !== 'customer') {
  alert("Unauthorized access");
  window.location.href = '../auth/login.html';
}

const productList = document.getElementById('productList');
const searchInput = document.getElementById('searchInput');

async function fetchApprovedProducts() {
  const res = await fetch('http://localhost:3000/products?status=approved');
  const products = await res.json();
  return products;
}

function renderProducts(products) {
  productList.innerHTML = "";

  if (products.length === 0) {
    productList.innerHTML = "<p>No products found.</p>";
    return;
  }

  products.forEach(p => {
    productList.innerHTML += `
      <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
        <strong>${p.name}</strong> - ${p.price} LE<br>
        Category: ${p.category}<br>
        <button onclick="addToCart(${p.id})">🛒 Add to Cart</button>
      </div>
    `;
  });
}

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert("Product added to cart!");
}

searchInput.addEventListener('input', async () => {
  const query = searchInput.value.toLowerCase();
  const allProducts = await fetchApprovedProducts();
  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
  renderProducts(filtered);
});

(async () => {
  const products = await fetchApprovedProducts();
  renderProducts(products);
})();
