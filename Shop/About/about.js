const productDiv = document.getElementById('productDetails');

// استخراج id من الرابط
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

if (productId) {
  fetch(`http://localhost:3000/products/${productId}`)
    .then(res => res.json())
    .then(product => {
      productDiv.innerHTML = `
        <div class="pro">
          <img src="${`../../${product.image}`}" alt="${product.name}" />
          <div class="des">
            <h2>${product.name}</h2>
            <p><strong>Brand:</strong> ${product.brand}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Description:</strong> ${product.description || 'No description added.'}</p>
          </div>
        </div>
      `;
    })
    .catch(() => {
      productDiv.innerHTML = "<p>Product not found.</p>";
    });
}
