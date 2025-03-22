import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import appointmentRoutes from "./routes/appointmentroutes.js"
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import faqRoutes from "./routes/faqRoute.js";
import aiRoutes from "./routes/appointmentairoutes.js";
import productsRoutes from './routes/productsRoutes.js';
import uploadRoutes from "./routes/uploadRoutes.js";
import path from "path";
import prebuildRoutes from "./routes/prebuildRoutes.js"; 
import filterRoutes from "./routes/filterRoutes.js";

import inquiryRoutes from "./routes/inquiryRoute.js";
import reviewRoutes from "./routes/reviewRoute.js";

dotenv.config();
const app = express();

// Consolidated CORS configuration
// Consolidated CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL if needed
  credentials: true, // Allows cookies & authentication headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  origin: "http://localhost:5173" || PORT,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};


// Apply CORS middleware once, before any routes are defined
// Apply CORS middleware once, before any routes are defined
app.use(cors(corsOptions));
// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Middleware for parsing JSON, cookies, and URL-encoded data
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// Middleware for parsing JSON, cookies, and URL-encoded data
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin:  'http://localhost:5173'||  PORT, // Replace with the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
app.use("/api/filters", filterRoutes);
app.use("/api/prebuilds", prebuildRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error: ", err.stack);
  res.status(500).send("Something went wrong!");
});
app.use("/api/ai", aiRoutes); 
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/reviews", reviewRoutes);

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
app.use("/api/filters", filterRoutes);
app.use("/api/prebuilds", prebuildRoutes);
  .catch((err) => console.log("MongoDB Connection Error:", err));


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
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });


// Start Server
// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
