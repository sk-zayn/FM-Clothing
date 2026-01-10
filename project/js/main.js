// ================================
// PRODUCTS PAGE JS (BACKEND SAFE)
// ================================

const list = document.getElementById("product-list");
window.allProducts = [];

// Fetch products from backend API
fetch("http://localhost:5000/api/products")
  .then((res) => res.json())
  .then((data) => {
    // 🔴 SAFETY CHECK
    if (!Array.isArray(data)) {
      console.error("Expected array, got:", data);
      list.innerHTML = "<p>Failed to load products</p>";
      return;
    }

    // If no products exist
    if (data.length === 0) {
      list.innerHTML = `
        <p style="text-align:center;color:#888;">
          No products available. Please add products from Admin.
        </p>
      `;
      return;
    }

    window.allProducts = data;
    list.innerHTML = "";

    // Render products
    data.forEach((p) => {
      list.innerHTML += `
  <div class="card" onclick="openDetail('${p._id}')">
    <img
  src="http://localhost:5000${p.images[0]}"
  alt="${p.name}"
>

    <h3>${p.name}</h3>
    <p>₹${p.price}</p>
    <p class="desc">${p.description.slice(0, 50)}...</p>
    <button class="btn"
      onclick="event.stopPropagation(); addToCart('${p._id}')">
      Add to Cart
    </button>
  </div>
`;
    });
  })
  .catch((err) => {
    console.error("FETCH ERROR:", err);
    list.innerHTML = "<p>Error loading products</p>";
  });

// Go to product detail page
function openDetail(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

// Add to cart
function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const product = window.allProducts.find((p) => p._id === id);
  if (!product) {
    alert("Product not found");
    return;
  }

  cart.push({ ...product, qty: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Added to cart");
}
