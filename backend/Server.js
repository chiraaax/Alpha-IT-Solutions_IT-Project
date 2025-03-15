import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import appointmentRoutes from "./routes/appointmentroutes.js";

//order
import OrderRoutes from "./routes/OrderManagement/orderRoutes.js";

// import productRoutes from "./src/products/products.route.js"; 
// import authRoutes from "./src/users/user.route.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173', // Replace with the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json()); // Parse JSON request body
app.use(cookieParser()); // Parse cookies


app.use("/api/appointments", appointmentRoutes);

app.use("/api/orders", OrderRoutes); // Order Routes

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Routes
// app.use("/api/users", authRoutes);
// app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
