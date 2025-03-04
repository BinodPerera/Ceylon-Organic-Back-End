const express = require('express');
const {registerUser, loginUser, getProfile, logoutUser, isLogged} = require("../controllers/authController");
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('is-logged', verifyToken, isLogged);

router.get("/profile", verifyToken, getProfile);

module.exports = router;