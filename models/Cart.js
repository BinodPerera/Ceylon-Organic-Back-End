const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: { type: String, require: true }, 
    productId: { type: String, require: true }, 
    quantity: { type: String, require: true }, 
});

module.exports = mongoose.model("Cart", cartSchema);