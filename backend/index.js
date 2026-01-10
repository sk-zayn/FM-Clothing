const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = 5000;

// ================================
// MIDDLEWARE
// ================================
app.use(cors());
app.use(express.json());

// ================================
// ROUTES
// ================================
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("FM Clothing backend running 🚀");
});

// ================================
// DATABASE + SERVER START
// ================================

const MONGO_URL = "mongodb+srv://fmadmin:Tetsukun09@fmclothing.0zvkc30.mongodb.net/?appName=FMClothing";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected ✅");

    // 🚀 START SERVER ONLY AFTER DB CONNECTS
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed ❌");
    console.error(err.message);
    process.exit(1); // stop app if DB fails
  });

  const path = require("path");

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
