import express from "express";
import Order from "../../models/OrderManagement/Order.js";  // Use ES Module import
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { fullName, phoneNumber, email, paymentMethod } = req.body;

    // Check if all required fields are present
    if (!fullName || !phoneNumber || !email || !paymentMethod) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const newOrder = new Order({ fullName, phoneNumber, email, paymentMethod });
    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: error.message || "Failed to place order." });
  }
});

export default router;  // Using ES Module export
