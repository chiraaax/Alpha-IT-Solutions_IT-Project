import express from "express";
import Order from "../../models/OrderManagement/Order.js";
// import { useParams } from "react-router-dom";
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
router.get('/orders/all', async (req, res) => {
  try {
      const order = await Order.find();
      if(!order || order.length === 0) {
        return res.status(404).json({message:"Order data not found"});
      }
      res.status(200).json(order);
  } catch (error) {
      res.status(500).json({ errorMessage: error.message });
  }
});

// GET a single order by ID
router.get("/orders/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email); // Decode email from URL
    console.log("Received GET request for email:", email);

    const order = await Order.findById(email);
    if (!order) {
      return res.status(404).json({ errorMessage: error.message });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/orders/:email", async (req, res) => {
  const email = decodeURIComponent(req.params.email); // Decode email from URL
  console.log("Received DELETE request for email:", email);

  try {
    const order = await Order.findOne({ email });

    // Check if the order exists
    if (!order) {
      return res.status(404).send("Order not found.");
    }

    // Get the current time and the order's creation time
    const now = new Date();
    const orderCreatedAt = new Date(order.createdAt);
    
    // Calculate the difference in milliseconds
    const timeDifference = now - orderCreatedAt;

    // Check if the order is older than 24 hours
    if (timeDifference > 24 * 60 * 60 * 1000) {  // 24 hours in milliseconds
      return res.status(400).send("Orders can only be deleted within 24 hours of creation.");
    }

    // Delete the order if it's within 24 hours
    await Order.deleteOne({ email });
    res.send({ message: "Order deleted successfully!" });
  } catch (error) {
    res.status(500).send("Error deleting order.");
  }
});


// Update an order if it's within 24 hours
router.put("/orders/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email); // Decode email from URL
    console.log("Received Update request for email:", email);

    // Find order by email instead of ID
    const order = await Order.findOne({ email: email }); // Assuming 'email' is a field in the Order model
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if it's within 24 hours
    const orderTime = new Date(order.createdAt);
    const currentTime = new Date();
    const diffHours = (currentTime - orderTime) / (1000 * 60 * 60);

    if (diffHours > 24) {
      return res
        .status(400)
        .json({ message: "Order cannot be updated after 24 hours" });
    }

    // Update the order with the new data
    const updatedOrder = await Order.findOneAndUpdate(
      { email: email }, // Update by email instead of ID
      req.body,
      { new: true, runValidators: true } // Ensures validation rules are applied
    );

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
