const express = require('express');
const uploadImage = require('../middleware/uploadProductImage');
const verifyToken = require('../middleware/auth');
const { insertProduct, getAllProducts, getProductById, getProductsByCategory, updateProduct, deleteProduct } = require('../controllers/productController');

const router =express.Router();

router.post("/", verifyToken, uploadImage.single("image"), insertProduct); 
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/category/:category", getProductsByCategory);
router.put("/:id", verifyToken, uploadImage.single("image"), updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

module.exports = router;