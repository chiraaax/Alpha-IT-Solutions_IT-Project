import express from "express";
import SuccessOrder from "../../models/OrderManagement/SuccessOrder.js";
import User from "../../models/userModel.js";
// import Order from "../../models/OrderManagement/Order.js";
const router = express.Router();

// route.post("/successOrder", create);
router.post("/create", async (req, res) => {
  try {
    const { customerId, totalAmount, status } = req.body;

    // Check if the user and order exist in the database
    // const order = await Order.findById(orderId);
    const user = await User.findById(customerId);

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const newSuccessOrder = new SuccessOrder({
      customerId,
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
    const Successorder = await SuccessOrder.find({ /*customerId: req.params.users.id*/ }).sort({ createdAt: -1 });
    res.json(Successorder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// GET all orders
router.get('/successorder/all', async (req, res) => {
  try {
      const order = await SuccessOrder.find();
      if(!order || order.length === 0) {
        return res.status(404).json({message:"Order data not found"});
      }
      res.status(200).json(order);
  } catch (error) {
      res.status(500).json({ errorMessage: error.message });
  }
});

// PUT successorder
router.put("/successorder/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await SuccessOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error("Update order error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;
