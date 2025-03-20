import express from "express";
import SuccessOrder from "../../models/OrderManagement/SuccessOrder.js";
const router = express.Router();

// Get all orders for a particular customer
router.get("/users/:id", async (req, res) => {
  try {
    const Successorder = await SuccessOrder.find({ customerId: req.params.users.id }).sort({ createdAt: -1 });
    res.json(Successorder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
