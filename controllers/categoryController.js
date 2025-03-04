const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");

// ✅ Create Category (Only Logged-in Users)
const createCategory = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const { name, description } = req.body;
        const imagePath = req.file ? `uploads/images/category/${req.file.filename}` : "";

        const newCategory = new Category({ name, description, image: imagePath });
        await newCategory.save();

        res.status(201).json({ message: "Category created successfully"});
    } catch (error) {
        res.status(500).json({ message: "Error creating category", error: error.message });
        console.log("error: ", error);
    }
};

// ✅ Get All Categories (Public Access)
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
};

// ✅ Get Single Category by ID (Only Logged-in Users)
const getCategoryById = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: "Error fetching category", error: error.message });
    }
};

// ✅ Update Category (Only Logged-in Users)
const updateCategory = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const { name, description } = req.body;
        let imagePath = "";

        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });

        // Handle Image Upload
        if (req.file) {
            if (category.image) {
                const oldImagePath = path.join(__dirname, "..", category.image);
                if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
            }
            imagePath = `uploads/${req.file.filename}`;
        } else {
            imagePath = category.image;
        }

        category.name = name;
        category.description = description;
        category.image = imagePath;

        await category.save();
        res.status(200).json({ message: "Category updated successfully"});
    } catch (error) {
        res.status(500).json({ message: "Error updating category", error: error.message });
    }
};

// ✅ Delete Category (Only Logged-in Users)
const deleteCategory = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });

        if (category.image) {
            const imagePath = path.join(__dirname, "..", category.image);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }

        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting category", error: error.message });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
