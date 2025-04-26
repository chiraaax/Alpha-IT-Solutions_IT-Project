import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";

// Import API Routes
import appointmentRoutes from "./routes/appointmentroutes.js";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import faqRoutes from "./routes/faqRoute.js";
import aiRoutes from "./routes/appointmentairoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import prebuildRoutes from "./routes/prebuildRoutes.js"; 
import filterRoutes from "./routes/filterRoutes.js";
import orderRoutes from "./routes/OrderManagement/orderRoutes.js";
import SuccessOrderRoutes from "./routes/OrderManagement/SuccessOrderRoutes.js";
import reportRoutes from './routes/reportRoutesShop.js';

import ExpenseRoutes from "./routes/Finance/ExpenseRoutes.js";
import IncomeRoutes from "./routes/Finance/IncomeRoutes.js";
import InvoiceRoutes from "./routes/Finance/InvoiceRoutes.js";

import inquiryRoutes from "./routes/inquiryRoute.js";
import reviewRoutes from "./routes/reviewRoute.js";
//products, ai
import compareRoutes from "./routes/compareRoutes.js";


dotenv.config();
const app = express();

// CORS Configuration
const corsOptions = {
  origin: "http://localhost:5173" || PORT, 
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve Static Uploads Folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API Routes
app.use('/api/appointments', appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", userRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/filters", filterRoutes);
app.use("/api/prebuilds", prebuildRoutes);
app.use("/api", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/successorders", SuccessOrderRoutes);
app.use("/api/reports", reportRoutes);
app.use('/api/expenses', ExpenseRoutes);
app.use('/api/income', IncomeRoutes);
app.use('/api/invoice', InvoiceRoutes);
app.use('/api/reports', reportRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api", compareRoutes);


// Home Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error: ", err.stack);
  res.status(500).send("Something went wrong!");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));