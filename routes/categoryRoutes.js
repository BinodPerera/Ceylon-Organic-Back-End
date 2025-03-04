const express = require("express");
const upload = require("../middleware/upload");
const verifyToken = require("../middleware/auth"); // ✅ Import auth middleware
const { 
    createCategory, 
    getAllCategories, 
    getCategoryById, 
    updateCategory, 
    deleteCategory 
} = require("../controllers/categoryController");

const router = express.Router();

router.post("/", verifyToken, upload.single("image"), createCategory); // ✅ Only logged-in users can create
router.get("/", getAllCategories); // Public route (optional: add verifyToken if needed)
router.get("/:id", verifyToken, getCategoryById); // ✅ Only logged-in users can view a specific category
router.put("/:id", verifyToken, upload.single("image"), updateCategory); // ✅ Only logged-in users can update
router.delete("/:id", verifyToken, deleteCategory); // ✅ Only logged-in users can delete

module.exports = router;
