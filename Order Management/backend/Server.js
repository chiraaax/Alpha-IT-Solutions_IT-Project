import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request body
app.use(cookieParser()); // Parse cookies

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Test API Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
