const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

// Connect Database
connectDB();

app.use(express.json()); // Body parser for JSON
app.use(cookieParser()); // Reason: To store JWT in cookies

// Middleware - Enable CORS to allow cookies
app.use(
  cors({
    origin: "https://ceylon-organic-front-end.vercel.app",
    credentials: true,
  })
);

app.use("/uploads", express.static("uploads")); // Serve uploaded images as static files

app.use(express.json()); // Body parser for JSON

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/auth", userRoutes);
const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/category", categoryRoutes);
const productRoutes = require("./routes/productRoutes");
app.use("/api/product", productRoutes);

app.use("/api/serverstatus", async ( req, res ) => {
  res.status(200).json({ message: "Server is running" });
})


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
