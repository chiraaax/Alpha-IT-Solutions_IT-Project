import express from "express";
// import { create } from "../../controller/orderController";
import SuccessOrder from "../../models/OrderManagement/SuccessOrder.js";
import User from "../../models/userModel.js";
import Order from "../../models/OrderManagement/Order.js";
const router = express.Router();

// route.post("/successOrder", create);
router.post("/create", async (req, res) => {
  try {
    const { userId, orderId, totalAmount, status } = req.body;

    // Check if the user and order exist in the database
    const customer = await User.findById(userId);
    const order = await Order.findById(orderId);

    if (!customer) {
      return res.status(400).json({ message: "User not found!" });
    }
    if (!order) {
      return res.status(400).json({ message: "Order not found!" });
    }

    const newSuccessOrder = new SuccessOrder({
      customerId: customer._id,
      orderId: order._id,
      totalAmount,
      status: status || "Pending",
    });

    await newSuccessOrder.save();
    res.status(201).json({ message: "SuccessOrder created successfully!", order: newSuccessOrder });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Get all orders for a particular customer
router.get("/successorder/:id", async (req, res) => {
  try {
    const Successorder = await SuccessOrder.find({ customerId: req.params.users.id }).sort({ createdAt: -1 });
    res.json(Successorder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
