const multer = require("multer");
const path = require("path");   // Reason: To get the file extension

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "uploads/images/product/"); // Save images inside product folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// Filter only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed!"), false);
    }
}

// Upload instance
const uploadProductImage = multer({ storage, fileFilter });
module.exports = uploadProductImage;