// ================================
// PRODUCT DETAIL PAGE (MULTI IMAGE + PRICE FIXED)
// ================================

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// HTML elements
const imageEl = document.getElementById("detailImage");
const nameEl = document.getElementById("detailName");
const priceEl = document.getElementById("detailPrice");
const descEl = document.getElementById("product-detail");
const qtyEl = document.getElementById("qty");

let currentProduct = null;
let qty = 1;
let basePrice = 0;

// -------------------------------
// FETCH PRODUCT
// -------------------------------
fetch("http://localhost:5000/api/products")
  .then(res => res.json())
  .then(data => {
    if (!Array.isArray(data)) {
      descEl.innerHTML = "<p>Failed to load product</p>";
      return;
    }

    const product = data.find(p => p._id === productId);

    if (!product) {
      descEl.innerHTML = "<p>Product not found</p>";
      return;
    }

    currentProduct = product;
    basePrice = product.price;

    // MAIN IMAGE
    imageEl.src = `http://localhost:5000${product.images[0]}`;

    // NAME
    nameEl.textContent = product.name;

    // DESCRIPTION + THUMBNAILS
    descEl.innerHTML = `
      <p class="description">
        ${product.description}
      </p>

      <div class="thumbs">
        ${product.images
          .map(
            img => `
              <img
                src="http://localhost:5000${img}"
                onclick="changeImage('${img}')"
              >
            `
          )
          .join("")}
      </div>
    `;

    updatePrice();
  })
  .catch(err => {
    console.error(err);
    descEl.innerHTML = "<p>Error loading product</p>";
  });

// -------------------------------
// CHANGE MAIN IMAGE (GLOBAL)
// -------------------------------
function changeImage(img) {
  imageEl.src = `http://localhost:5000${img}`;
}

// -------------------------------
// UPDATE PRICE
// -------------------------------
function updatePrice() {
  priceEl.textContent = `₹${basePrice * qty}`;
}

// -------------------------------
// QTY CONTROLS
// -------------------------------
function changeQty(value) {
  qty += value;
  if (qty < 1) qty = 1;

  qtyEl.textContent = qty;
  updatePrice();
}

// -------------------------------
// ADD TO CART
// -------------------------------
function addToCart() {
  if (!currentProduct) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push({
    ...currentProduct,
    qty,
    totalPrice: basePrice * qty
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}
