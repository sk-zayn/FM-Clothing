let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cart-items");
const subtotalEl = document.getElementById("subtotal");
const gstEl = document.getElementById("gst");
const totalEl = document.getElementById("grand-total");

const DELIVERY_CHARGE = 99;
const GST_RATE = 0.18;

function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p class='empty-cart'>Your cart is empty 🛒</p>";
    subtotalEl.innerText = "₹0";
    gstEl.innerText = "₹0";
    totalEl.innerText = "₹0";
    return;
  }

  let subtotal = 0;

  cart.forEach((item, index) => {
    item.qty = item.qty || 1;
    subtotal += item.price * item.qty;

    cartItems.innerHTML += `
      <div class="cart-card">
        <img src="http://localhost:5000${item.images[0]}"
          onerror="this.src='https://via.placeholder.com/150x200?text=FM'">


        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>₹${item.price}</p>

          <div class="qty">
            <button onclick="changeQty(${index}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${index}, 1)">+</button>
          </div>

          <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
        </div>
      </div>
    `;
  });

  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst + DELIVERY_CHARGE;

  subtotalEl.innerText = "₹" + subtotal;
  gstEl.innerText = "₹" + gst;
  totalEl.innerText = "₹" + total;

  localStorage.setItem("cart", JSON.stringify(cart));
}

function changeQty(index, value) {
  cart[index].qty += value;
  if (cart[index].qty < 1) cart[index].qty = 1;
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

renderCart();
