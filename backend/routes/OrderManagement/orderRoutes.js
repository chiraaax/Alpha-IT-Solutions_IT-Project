import express from "express";
import Order from "../../models/OrderManagement/Order.js";

const router = express.Router();

router.post("/orders", async (req, res) => {
  try {
    console.log("Incoming order request:", req.body);

    const {
      name,
      phoneNo,
      email,
      paymentMethod,
      address,
      deliveryDate,
      deliveryTime,
      pickupDate,
      pickupTime,
      saveAddress,
    } = req.body;

    if (!name || !phoneNo || !email || !paymentMethod) {
      console.error("Missing required fields!");
      return res.status(400).json({ message: "Missing required fields" });
    }

    let orderData = { name, phoneNo, email, paymentMethod, saveAddress };

    if (paymentMethod === "COD") {
      if (!address || !deliveryDate || !deliveryTime) {
        console.error("Missing COD details!");
        return res
          .status(400)
          .json({
            message:
              "Address, delivery date, and delivery time are required for COD orders",
          });
      }
      orderData.codDetails = { address, deliveryDate, deliveryTime };
    } else if (paymentMethod === "Pickup") {
      if (!pickupDate || !pickupTime) {
        console.error("Missing Pickup details!");
        return res
          .status(400)
          .json({
            message:
              "Pickup date and pickup time are required for Pickup orders",
          });
      }
      orderData.pickupDetails = { pickupDate, pickupTime };
    } else {
      console.error("Invalid payment method");
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const order = new Order(orderData);
    await order.save();
    console.log("Order saved:", order);
    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res
      .status(500)
      .json({ message: "Failed to place order. Please check again." });
  }
});

// GET all orders
router.get('/orders/:id', async (req, res) => {
  try {
      const order = await Order.find();
      res.status(200).json(order);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// GET a single order by ID
router.get('/orders/:id', async (req, res) => {
  try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json(order);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Delete order if it's within 24 hours
router.delete("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params.id
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderTime = new Date(order.createdAt);
    const currentTime = new Date();
    const diffHours = (currentTime - orderTime) / (1000 * 60 * 60);

    if (diffHours > 24) {
      return res
        .status(400)
        .json({ message: "Order cannot be deleted after 24 hours" });
    }

    await Order.findByIdAndDelete(id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
});

router.put("/orders/:id", async (req, res) => {
  try {
    const {id} = req.params.id
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderTime = new Date(order.createdAt);
    const currentTime = new Date();
    const diffHours = (currentTime - orderTime) / (1000 * 60 * 60);

    if (diffHours > 24) {
      return res
        .status(400)
        .json({ message: "Order cannot be updated after 24 hours" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      req.body,
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order" });
  }
});
export default router;
