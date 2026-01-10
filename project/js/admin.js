// ================================
// ADMIN PAGE (MULTI IMAGE – FIXED)
// ================================

console.log("ADMIN JS LOADED");

const form = document.getElementById("adminForm");
const productList = document.getElementById("productList");

// Inputs
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const descriptionInput = document.getElementById("description");
const imagesInput = document.getElementById("images");

// Preview elements
const previewImg = document.getElementById("previewImg");
const previewName = document.getElementById("previewName");
const previewPrice = document.getElementById("previewPrice");

// -------------------------------
// LIVE PREVIEW
// -------------------------------
nameInput.addEventListener("input", () => {
  previewName.textContent = nameInput.value || "Product Name";
});

priceInput.addEventListener("input", () => {
  previewPrice.textContent = "₹" + (priceInput.value || 0);
});

imagesInput.addEventListener("change", () => {
  if (imagesInput.files.length > 0) {
    previewImg.src = URL.createObjectURL(imagesInput.files[0]);
  } else {
    previewImg.src = "https://via.placeholder.com/300x400";
  }
});

// -------------------------------
// ADD PRODUCT
// -------------------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (imagesInput.files.length === 0) {
    alert("Please select at least one image");
    return;
  }

  const formData = new FormData();
  formData.append("name", nameInput.value.trim());
  formData.append("price", priceInput.value);
  formData.append("description", descriptionInput.value.trim());

  for (let file of imagesInput.files) {
    formData.append("images", file);
  }

  try {
    const res = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Upload failed");

    alert("Product added successfully ✅");

    form.reset();
    previewImg.src = "https://via.placeholder.com/300x400";
    previewName.textContent = "Product Name";
    previewPrice.textContent = "₹0";

    loadProducts();
  } catch (err) {
    console.error(err);
    alert("Error adding product ❌");
  }
});

// -------------------------------
// LOAD PRODUCTS
// -------------------------------
async function loadProducts() {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();

    productList.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      productList.innerHTML = "<p>No products added yet.</p>";
      return;
    }

data.forEach((p) => {
  productList.innerHTML += `
    <div class="admin-product-row">
      <div class="admin-imgs">
        ${p.images
          .map(
            img => `
              <div class="admin-img-wrap">
                <img src="http://localhost:5000${img}">
                <button onclick="removeImage('${p._id}','${img}')">×</button>
              </div>
            `
          )
          .join("")}
      </div>

      <div class="admin-info">
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
      </div>
    </div>
  `;
});

  } catch (err) {
    console.error(err);
    productList.innerHTML = "<p>Failed to load products</p>";
  }
}

// -------------------------------
// RESET (DISABLED)
// -------------------------------
function resetProducts() {
  alert("Reset feature will be added later ⚠️");
}

// -------------------------------
// INITIAL LOAD
// -------------------------------
loadProducts();

async function removeImage(productId, imagePath) {
  const confirmDelete = confirm("Remove this image?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/products/${productId}/image`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image: imagePath })
      }
    );

    if (!res.ok) throw new Error("Failed to remove image");

    loadProducts(); // refresh UI
  } catch (err) {
    console.error(err);
    alert("Error removing image ❌");
  }
}
