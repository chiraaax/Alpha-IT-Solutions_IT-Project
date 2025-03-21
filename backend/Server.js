import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

//order
import orderRoutes from "./routes/OrderManagement/orderRoutes.js"
import SuccessOrderRoutes from "./routes/OrderManagement/SuccessOrderRoutes.js"

// import productRoutes from "./src/products/products.route.js"; 
// import authRoutes from "./src/users/user.route.js";
import appointmentRoutes from "./routes/appointmentroutes.js"
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import faqRoutes from "./routes/faqRoute.js";
import aiRoutes from "./routes/appointmentairoutes.js";
import ExpenseRoutes from "./routes/Finance/ExpenseRoutes.js";
import productsRoutes from './routes/productsRoutes.js';
import uploadRoutes from "./routes/uploadRoutes.js";
import path from "path";
import prebuildRoutes from "./routes/prebuildRoutes.js"; // ✅ Correct Import


dotenv.config();
const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allow credentials (cookies, authorization headers)
};

// Apply CORS middleware
app.use(cors(corsOptions));

// CORS Configuration
app.use(cors({
  origin: "http://localhost:5173", // Replace with frontend URL
  credentials: true, // ✅ Allows cookies & authentication headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allows headers
}));

// Middleware
app.use(express.json()); // Parse JSON request body
app.use(cookieParser()); // Parse cookies
app.use(express.urlencoded({ extended: true })); // Handles URL-encoded data

// API Routes
// Routes
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", userRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/ai", aiRoutes);
app.use('/api/products', productsRoutes);
app.use("/api", uploadRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Handle preflight requests (OPTIONS)
app.options("*", cors());

// MongoDB Connection
app.use("/api/ai", aiRoutes);
app.use("/api/prebuilds", prebuildRoutes); // ✅ Now works properly

app.use("/api/orders", orderRoutes); // Order Routes
app.use("/api/successorders", SuccessOrderRoutes); // SuccessOrder Routes

app.use("/api/expenses", ExpenseRoutes); 

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1); // Exit process on failure
  });

// Home route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error: ", err.stack);
  res.status(500).send("Something went wrong!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
