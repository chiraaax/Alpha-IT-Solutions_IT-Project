import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import appointmentRoutes from "./routes/appointmentroutes.js"

const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Replace with the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json()); // Parse JSON request body
app.use(cookieParser()); // Parse cookies

app.use("/api/appointments", appointmentRoutes);

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
