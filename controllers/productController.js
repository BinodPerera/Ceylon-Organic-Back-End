const Product = require("./../models/Product");
const fs = require("fs");   // Reason: To delete the images from the server
const path = require("path");   // Reason: To get the file extension

// create product(Only allow to logged in users)
const insertProduct = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: "User not logged in" });

        const { name, description, price, category } = req.body;
        const imagePath = req.file ? `uploads/images/product/${req.file.filename}` : "";

        const newProduct = new Product({ name, description, price, image: imagePath, category });
        await newProduct.save();

        res.status(201).json({ message: "Product inserted Successfully"});
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// get all products
const getAllProducts = async (req, res) => {
    try {
        const product = await Product.find();
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// get Each product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).json({ error: "Product not found" });
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get products by category
const getProductsByCategory = async (req, res) => {
    console.log(req.params.category);
    try {
        const products = await Product.find({ category: req.params.category });
        if(!products) return res.status(404).json({ error: "Products not found" });
        res.status(200).json(products);
        console.log(req.params.category);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// update product
const updateProduct = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: "User not logged in" });

        const { name, description, price, category } = req.body;
        let imagePath = "";

        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).json({ error: "Product not found" });

        // Handle image upload
        if (req.file) {
            if (product.image) {
                fs.unlinkSync(product.image);
            }
            imagePath = `uploads.images/product/${req.file.filename}`;
        }
        else {
            imagePath = product.image;
        }

        product.name = name;
        product.description = description;
        product.price = price;
        product.image = imagePath;
        product.category = category;

        await product.save();
        res.status(200).json({ message: "Product updated successfully"});
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// delete product
const deleteProduct = async (req, res) => {
    try {
        if(!req.user) return res.status(401).json({ error: "User not logged in" });

        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).json({ error: "Product not found" });

        if (product.image) {
            fs.unlinkSync(product.image);
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully"});
    }
    catch (error) {
        res.status(500).json({ error: error.message})
    }
}

module.exports = { insertProduct, getAllProducts, getProductById, getProductsByCategory, updateProduct, deleteProduct };