const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

dotenv.config();
const app = express();

// Connect Database
connectDB();

app.use(express.json()); // Body parser for JSON
app.use(cookieParser()); // Reason: To store JWT in cookies

// Middleware - Enable CORS to allow cookies
app.use(
  cors({
    origin: process.env.CLIENT_URL,
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

app.post('/create-checkout-session', async (req, res) => {
  const { amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: 'Test Product',
            },
            unit_amount: amount, // in cents (100 = A$1.00)
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use("/api/serverstatus", async ( req, res ) => {
  res.status(200).json({ message: "Server is running" });
})


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
