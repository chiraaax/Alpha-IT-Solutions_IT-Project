import express from "express";
import SuccessOrder from "../../models/OrderManagement/SuccessOrder.js";
import User from "../../models/userModel.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

// route.post("/successOrder", create);
router.post("/create", authMiddleware(["customer"]), async (req, res) => {
  try {
    const { totalAmount, status, items } = req.body;

    // inside router.post("/create", …)
    const requiredLabels = ["Processor", "GPU", "RAM", "Storage", "Power Supply", "Casing"];

    for (const item of req.body.items) {
      if (item.itemType === "prebuild") {
        const labels = (item.specs || []).map(s => s.label);
        const missing = requiredLabels.filter(l => !labels.includes(l));
    
        if (missing.length) {
          return res
            .status(400)
            .json({ message: `Item ${item.itemId} missing specs: ${missing.join(", ")}` });
        }
      }
    }
    // Validate each item's itemType
    for (const item of items) {
      if (!["Product", "PreBuild"].includes(item.itemType)) {
        return res.status(400).json({ message: "Invalid itemType. It must be 'Product' or 'PreBuild'." });
      }
    }

    const customerId = req.user._id;

    // Check if the user exists in the database
    const user = await User.findById(customerId);
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    // Create a new SuccessOrder with itemType and itemId
    const newSuccessOrder = new SuccessOrder({
      customerId,
      totalAmount,
      status: status || "Pending",
      items, // Store itemType as either "product" or "prebuild"
    });

    await newSuccessOrder.save();
    res.status(201).json({ message: "SuccessOrder created successfully!", order: newSuccessOrder });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Get all orders for a particular customer
router.get("/:id", async (req, res) => {
  try {
    const successOrder = await SuccessOrder.find({ customerId: req.user._id }).sort({ createdAt: -1 });
    if (!successOrder || successOrder.length === 0) {
      return res.status(404).json({ message: "No orders found for this customer." });
    }
    res.json(successOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// GET all orders
router.get('/successOrder/all',authMiddleware(["customer"]) , async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const customerId = req.user._id; // assuming user is authenticated
    console.log("Fetching orders for customerId:", customerId);

    const orders = await SuccessOrder.findOne({ customerId })
      .populate("items.itemId") // populate details for product/prebuild
      .sort({ createdAt: -1 }); // most recent first

    // const orders = await SuccessOrder.find();
    console.log("Fetched orders:", orders);

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.stack); 
    console.error(error); // Log the error for debugging
    res.status(500).json({ errorMessage: error.message });
  }
});

// PUT successorder
router.put("/:id", async (req, res) => {
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
