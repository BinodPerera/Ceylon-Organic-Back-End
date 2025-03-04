const { error } = require("console");
const Cart = require("../models/Cart");
const fs = require("fs");
const path = require("path");

const addToCart = async (req, res){
    try{
        // check  if user logged or not
        if(!req.user) return res.status(401).json({ error: "Unauthorized!"});

        const { productId, quantity } = req.body;
        const userId = req.user.userId;
        
        
    }
    catch(error){
        res.status(500).json({ error: "Error Add item into cart!"});
    }
};