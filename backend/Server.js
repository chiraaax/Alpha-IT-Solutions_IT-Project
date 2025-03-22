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
import productsRoutes from "./routes/productsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import path from "path";
import prebuildRoutes from "./routes/prebuildRoutes.js"; // ✅ Correct Import


dotenv.config();
const app = express();

// ✅ CORS configuration (Removed duplicate middleware)
const corsOptions = {
  origin: "http://localhost:5173", // Replace with frontend URL
  credentials: true, // Allows cookies & authentication headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"], // Allows necessary headers
};
app.use(cors(corsOptions)); // ✅ Applied only once

// Middleware
app.use(express.json()); // Parse JSON request body
app.use(cookieParser()); // Parse cookies
app.use(express.urlencoded({ extended: true })); // Handles URL-encoded data

// ✅ MongoDB Connection (Moved above API routes to prevent access issues)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Exit process on failure
  });

// ✅ Routes (Fixed misplaced `/api/prebuilds`)
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", userRoutes);
app.use("/api/faq", faqRoutes);

// ✅ Fixed Duplicate Route Declaration (Removed extra `/api/ai`)
app.use("/api/ai", aiRoutes);
app.use("/api/prebuilds", prebuildRoutes); // ✅ Ensured it's placed correctly

app.use("/api/products", productsRoutes);
app.use("/api", uploadRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Handle preflight requests (OPTIONS)
app.options("*", cors());

// MongoDB Connection
app.use("/api/ai", aiRoutes);
app.use("/api/prebuilds", prebuildRoutes); // ✅ Now works properly

app.use("/api/orders", orderRoutes); // Order Routes
app.use("/api/successorders", SuccessOrderRoutes); // SuccessOrder Routes

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
// ✅ Home route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ✅ Global Error Handler (Improved logging)
app.use((err, req, res, next) => {
  console.error("🔥 Global Error: ", err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
