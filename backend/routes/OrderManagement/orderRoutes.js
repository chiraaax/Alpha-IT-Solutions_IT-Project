// import express from "express"; 
// import placeOrder from "../../controller/orderController.js";
// const router = express.Router();

// // POST request to create a new order
// router.post("/orders", placeOrder);

// export default router;

import express from "express";
import Order from "../../models/OrderManagement/Order.js";

const router = express.Router();

router.post("/orders", async (req, res) => {
  try {
    console.log("🔹 Incoming order request:", req.body);

    const { name, phoneNo, email, paymentMethod, address, deliveryDate, deliveryTime, pickupDate, pickupTime, saveAddress } = req.body;

    if (!name || !phoneNo || !email || !paymentMethod) {
      console.error("Missing required fields!");
      return res.status(400).json({ message: "Missing required fields" });
    }

    let orderData = { name, phoneNo, email, paymentMethod, saveAddress };

    if (paymentMethod === "COD") {
      if (!address || !deliveryDate || !deliveryTime) {
        console.error("Missing COD details!");
        return res.status(400).json({ message: "Address, delivery date, and delivery time are required for COD orders" });
      }
      orderData.codDetails = { address, deliveryDate, deliveryTime };
    } else if (paymentMethod === "Pickup") {
      if (!pickupDate || !pickupTime) {
        console.error("Missing Pickup details!");
        return res.status(400).json({ message: "Pickup date and pickup time are required for Pickup orders" });
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
    res.status(500).json({ message: "Failed to place order. Please check again." });
  }
});

export default router;

