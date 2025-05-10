let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsContainer = document.getElementById("cartItems");
const totalPriceElement = document.getElementById("totalPrice");

async function fetchCartDetails() {
  try {
    const res = await fetch("http://localhost:3000/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    const allProducts = await res.json();

    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is empty!</p>`;
      totalPriceElement.textContent = `Total: 0 EGP`;
      return;
    }

    cart.forEach((item, index) => {
      const product = allProducts.find(p => String(p.id) === String(item.productId));
      if (!product) {
        console.warn(`Product with ID ${item.productId} not found`);
        return;
      }

      const itemTotal = item.quantity * product.price;
      total += itemTotal;

      const cartCard = document.createElement("div");
      cartCard.className = "cart-card";
      cartCard.innerHTML = `
        <img src="../${product.image}" alt="${product.name}">
        <h4>${product.name}</h4>
        <p><strong>Price:</strong> ${product.price} EGP</p>
        <p><strong>Quantity:</strong> ${item.quantity}</p>
        <p><strong>Total:</strong> ${itemTotal} EGP</p>
        <button class="btn btn-delete" onclick="removeItem(${index})"><i class="fas fa-trash"></i> Remove</button>
      `;
      cartItemsContainer.appendChild(cartCard);
    });

    totalPriceElement.textContent = `Total: ${total} EGP`;
  } catch (error) {
    console.error("Error fetching cart details:", error);
    cartItemsContainer.innerHTML = `<p class="empty-cart">Error loading cart. Please try again later.</p>`;
  }
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  fetchCartDetails();
}

// function checkout() {
//   if (cart.length === 0) {
//     alert("Your cart is empty!");
//     return;
//   }

//   alert("✅ Order placed successfully! Thank you for shopping with us");
//   localStorage.removeItem("cart");
//   cart = [];
//   fetchCartDetails();
// }

async function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "customer") {
    alert("You must be logged in as a customer to place an order.");
    return;
  }

  const res = await fetch("http://localhost:3000/products");
  const products = await res.json();

  let total = 0;
  const items = cart.map(item => {
    const product = products.find(p => String(p.id) === String(item.productId));
    if (!product) return null;
    total += product.price * item.quantity;
    return {
      productId: String(item.productId),
      quantity: item.quantity
    };
  }).filter(Boolean);

  const order = {
    userId: currentUser.id,
    items: items,
    total: total,
    status: "Processing"
  };

  await fetch("http://localhost:3000/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(order)
  });

  alert("✅ Order placed successfully!");
  localStorage.removeItem("cart");
  cart = [];
  fetchCartDetails();
}


fetchCartDetails();