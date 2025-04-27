// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";

// Import API Routes
import appointmentRoutes from "./routes/appointmentRoutes.js";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import faqRoutes from "./routes/faqRoute.js";
import aiRoutes from "./routes/appointmentAiRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import prebuildRoutes from "./routes/prebuildRoutes.js";
import filterRoutes from "./routes/filterRoutes.js";
import orderRoutes from "./routes/OrderManagement/orderRoutes.js";
import successOrderRoutes from "./routes/OrderManagement/successOrderRoutes.js";
import reportRoutes from "./routes/reportRoutesShop.js";
import expenseRoutes from "./routes/Finance/ExpenseRoutes.js";
import incomeRoutes from "./routes/Finance/IncomeRoutes.js";
import invoiceRoutes from "./routes/Finance/InvoiceRoutes.js";
import inquiryRoutes from "./routes/inquiryRoute.js";
import reviewRoutes from "./routes/reviewRoute.js";
import chatBotRoutes from "./routes/chatbotRoute.js";
import blogRoutes from "./routes/blogRoute.js";
import suggestBuildRoutes from "./routes/suggestBuildRoutes.js";

dotenv.config();
const app = express();

// ─── Logging Middleware (before all routes) ─────────────────────────────────
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url}`,
    req.body && Object.keys(req.body).length ? req.body : ""
  );
  next();
});

// ─── Middleware ─────────────────────────────────────────────────────────────
const corsOptions = {
  origin: "http://localhost:5173",  // adjust if your front end URL changes
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Static Files ────────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ─── API Routes ─────────────────────────────────────────────────────────────
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
//app.use('/api/successorder',orderRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/chatbot", chatBotRoutes);
app.use("/api/blogs", blogRoutes);
app.use('/api/auth',        authRoutes);
app.use('/api/profile',     userRoutes);
app.use('/api/faq',         faqRoutes);
app.use('/api/ai',          aiRoutes);
app.use('/api/products',    productsRoutes);
app.use('/api/filters',     filterRoutes);
app.use('/api/prebuilds',   prebuildRoutes);
app.use('/api/upload',      uploadRoutes);
app.use('/api/orders',      orderRoutes);
app.use('/api/successorders', successOrderRoutes);
app.use('/api/reports',     reportRoutes);
app.use('/api/expenses',    expenseRoutes);
app.use('/api/income',      incomeRoutes);
app.use('/api/invoice',     invoiceRoutes);
app.use('/api/inquiries',   inquiryRoutes);
app.use('/api/reviews',     reviewRoutes);
app.use("/api", suggestBuildRoutes);

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong' });
});

// ─── Connect to MongoDB and Start Server ─────────────────────────────────────
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });