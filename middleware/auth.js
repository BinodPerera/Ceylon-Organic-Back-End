const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    console.log("Cookies:", req.cookies); // Debugging
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No Token Provided!"});
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        console.log("Verified User:", verified); // Debugging
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message); // Debugging
        res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = verifyToken;
