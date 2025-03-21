import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import appointmentRoutes from "./routes/appointmentroutes.js";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import faqRoutes from "./routes/faqRoute.js";
import aiRoutes from "./routes/appointmentairoutes.js";
import productsRoutes from './routes/productsRoutes.js';
import uploadRoutes from "./routes/uploadRoutes.js";
import path from "path";

dotenv.config();
const app = express();

// CORS Configuration
app.use(cors({
  origin: "http://localhost:5173", // Replace with frontend URL
  credentials: true, // ✅ Allows cookies & authentication headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allows headers
}));

app.use(express.json()); // Parse JSON request body
app.use(cookieParser()); // Parse cookies

// API Routes
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
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
