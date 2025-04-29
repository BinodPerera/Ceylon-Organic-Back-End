const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// user register
const registerUser = async (req, res) => {
    try{
        const { username, email, password } = req.body;
        const role = 0;

        // check if user already exists 
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: "User already exists" });
        }

        // create new user 
        const newUser = new User({ username, email, password, role });
        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            userId : newUser._id
        });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: `error: ${error.message}`});
    }
};

// user login
const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        // checking user is axist or not
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email or Password!"});
        }

        // validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Email or Password!"});
        }

        // generate JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // send JWT as HTTP only coockie
        res.cookie( "token", token, {
            httpOnly: true,
            secure: true, // set to `true` in production
            sameSite: "none",
            maxAge: 3600000,
        });

        res.status(200).json({ message: "User logged in Successfully!", token });

    } catch(error) {
        res.status(500).json({ message: "Something went wrong", error: `error: ${error.message}`});
    }
};

// user Dashboard
const getProfile = async ( req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(400).json({ message: "User not found!"});
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong When loading user Profile Details!", error: `error: ${error.message}`});
        console.error("Error loading user profile:", error.message); // Debugging
    }
}

// user logout
const logoutUser = ( req, res) => {
    res.cookie( "token", "", { httpOnly: true, expires: new Date(0) }); // setting cookie to expire the token
    res.status(200).json({ body: "Logged out successfuly!" });
}

const isLogged = async (req, res) => {
    try{
        if(req.cookies.token){
            return res.status(200).json({ authenticated: true });
        }else{
            return res.status(200).json({ authenticated: false });
        }
    }
    catch(error){
        console.log("Error");
    }
}

module.exports = { registerUser, loginUser, getProfile, logoutUser, isLogged }; 