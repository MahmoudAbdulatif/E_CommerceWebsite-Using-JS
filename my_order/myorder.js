const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "customer" && currentUser.role !== "admin" && currentUser.role !== "seller") {
  alert("Please log in as a customer.");
  window.location.href = "../Login/login.html";
}

const ordersList = document.getElementById("ordersList");

async function fetchOrders() {
  const res = await fetch(`http://localhost:3000/orders?userId=${currentUser.id}`);
  const orders = await res.json();

  if (orders.length === 0) {
    ordersList.innerHTML = "<p>You have no orders yet.</p>";
    return;
  }

  ordersList.innerHTML = "";

  for (let order of orders) {
    let productsDetails = "";

    for (let item of order.items) {
      const resProduct = await fetch(`http://localhost:3000/products/${item.productId}`);
      const product = await resProduct.json();

      productsDetails += `
        <li>
          <img src="${product.image || '../img/products/f1.jpg'}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
          ${product.name} - ${item.quantity} × ${product.price} EGP
        </li>
      `;
    }

    ordersList.innerHTML += `
      <div style="border:1px solid #ccc; margin-bottom: 20px; padding:10px;">
        <h4>🧾 Order #${order.id}</h4>
        <ul>${productsDetails}</ul>
        <p><strong>Total:</strong> ${order.total} EGP</p>
        <p><strong>Status:</strong> ${order.status}</p>
      </div>
    `;
  }
}

fetchOrders();