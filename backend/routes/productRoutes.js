const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");

// ------------------
// MULTER CONFIG
// ------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpg|jpeg|png|webp/;
    const ext = allowed.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (ext) cb(null, true);
    else cb("Images only!");
  }
});

// ------------------
// ADD PRODUCT
// ------------------
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const imagePaths = req.files.map(
      file => `/uploads/${file.filename}`
    );

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      images: imagePaths
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// ------------------
// GET PRODUCTS
// ------------------
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

module.exports = router;

// REMOVE SINGLE IMAGE FROM PRODUCT
router.delete("/:id/image", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Image path required" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Remove image from array
    product.images = product.images.filter(img => img !== image);
    await product.save();

    res.json({ success: true, images: product.images });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
