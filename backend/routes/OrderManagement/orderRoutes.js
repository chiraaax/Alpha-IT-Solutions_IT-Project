import express from "express";
import Order from "../../models/OrderManagement/Order.js";
import SuccessOrder from "../../models/OrderManagement/SuccessOrder.js";
import authMiddleware from "../../middleware/authMiddleware.js";
// import User from "../../models/userModel.js";

const router = express.Router();

router.post("/create", authMiddleware(["customer"]), async (req, res) => {
  try {
    // console.log("Incoming order request:", req.body);
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

    // ✅ Fetch the actual user
    // const customer = await User.findOne({ email });
    const customerId = req.user._id;

    if (!customerId) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Fetch the SuccessOrder using user's _id
    const Successorder = await SuccessOrder.findOne({ customerId })
      .sort({ createdAt: -1 });

    if (!Successorder) {
      return res
        .status(404)
        .json({ message: "SuccessOrder not found for this customer" });
    }

    let orderData = {
      SuccessorderId: Successorder._id,
      customerId,
      name,
      phoneNo,
      email,
      paymentMethod,
      saveAddress,
    };

    if (paymentMethod === "COD") {
      if (!address || !deliveryDate || !deliveryTime) {
        console.error("Missing COD details!");
        return res.status(400).json({
          message:
            "Address, delivery date, and delivery time are required for COD orders",
        });
      }
      orderData.codDetails = { address, deliveryDate, deliveryTime };
    } else if (paymentMethod === "Pickup") {
      if (!pickupDate || !pickupTime) {
        console.error("Missing Pickup details!");
        return res.status(400).json({
          message: "Pickup date and pickup time are required for Pickup orders",
        });
      }
      orderData.pickupDetails = { pickupDate, pickupTime };
    } else {
      console.error("Invalid payment method");
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const validTimeSlots = [
      "9:00 AM - 11:00 AM",
      "11:00 AM - 1:00 PM",
      "2:00 PM - 4:00 PM",
      "4:00 PM - 6:00 PM",
      "6:00 PM - 8:00 PM",
    ];
    
    if (paymentMethod === 'COD' && !validTimeSlots.includes(deliveryTime)) {
      return res.status(400).json({ message: "Invalid delivery time slot" });
    }
    
    if (paymentMethod === 'Pickup' && !validTimeSlots.includes(pickupTime)) {
      return res.status(400).json({ message: "Invalid pickup time slot" });
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
router.get("/all", async (req, res) => {
  try {
    const order = await Order.find();
    if (!order || order.length === 0) {
      return res.status(404).json({ message: "Order data not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
});

// GET a single order by ID
router.get("/:id", async (req, res) => {
  try {
    const id = decodeURIComponent(req.params.id); // Decode email from URL
    console.log("Received GET request for id:", id);

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ errorMessage: error.message });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = decodeURIComponent(req.params.id); // fixed here
  console.log("Received DELETE request for order ID:", id);

  try {
    const order = await Order.findById(id); // fixed from findOne({ id }) to findById(id)

    if (!order) {
      return res.status(404).send("Order not found.");
    }

    const now = new Date();
    const orderCreatedAt = new Date(order.createdAt);
    const timeDifference = now - orderCreatedAt;

    if (timeDifference > 24 * 60 * 60 * 1000) {
      return res
        .status(400)
        .send("Orders can only be deleted within 24 hours of creation.");
    }

    // 🔥 Delete associated successOrder using successOrderId in order
    if (order.SuccessorderId) {
      await SuccessOrder.findByIdAndDelete(order.SuccessorderId);
      console.log("Deleted related successOrder:", order.SuccessorderId);
    }

    await Order.findByIdAndDelete(id); // fix this as well
    res.send({
      message: "Order and its related cart details deleted successfully.",
    });
  } catch (error) {
    res.status(500).send("Error deleting order.");
  }
});

// Update an order if it's within 24 hours
router.put("/:id", async (req, res) => {
  try {
    const id = decodeURIComponent(req.params.id);
    console.log("Received Update request for order ID:", id);

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderTime = new Date(order.createdAt);
    const currentTime = new Date();
    const diffHours = (currentTime - orderTime) / (1000 * 60 * 60);

    if (diffHours > 24) {
      return res.status(400).json({
        message: "Order cannot be updated after 24 hours",
      });
    }

    // Prepare updateData based on payment method
    const setFields = { ...req.body };
    const unsetFields = {};

    if (req.body.paymentMethod === "COD") {
      setFields.codDetails = req.body.codDetails;
      unsetFields.pickupDetails = "";
    } else if (req.body.paymentMethod === "Pickup") {
      setFields.pickupDetails = req.body.pickupDetails;
      unsetFields.codDetails = "";
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        $set: setFields,
        $unset: unsetFields,
      },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
