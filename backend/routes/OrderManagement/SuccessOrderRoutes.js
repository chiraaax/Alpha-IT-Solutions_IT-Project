import express from "express";
import SuccessOrder from "../../models/OrderManagement/SuccessOrder.js";
import User from "../../models/userModel.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import sendEmail from "../../utils/sendEmail.js";
import Transaction from "../../models/Finance/Transaction.js";
import Product from "../../models/Product.js";
import PreBuild from "../../models/PreBuild.js";
import Invoice from "../../models/Finance/Invoice.js";
import { createInvoicePDF } from "../../utils/invoicePdf.js"
import fs from 'fs';

import authMiddleware from "../../middleware/authMiddleware.js";
import Order from "../../models/OrderManagement/Order.js";


const router = express.Router();

// route.post("/successOrder", create);
router.post("/create", authMiddleware(["customer"]), async (req, res) => {
  try {
    const { totalAmount, status, items } = req.body;

    // inside router.post("/create", …)
    const requiredLabels = ["Processor", "GPU", "RAM", "Storage", "Power Supply", "Casing"];

    for (const item of req.body.items) {
      if (item.itemType === "PreBuild") {
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

// Get all orders for a particular customer OR all orders if admin
router.get("/admin/:id", authMiddleware(), async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const orderId = req.params.id;

    // 🔥 Fetch order and populate customer details
    const order = await SuccessOrder.findById(orderId).populate({
      path: "customerId",
      select: "name email contactNumber" // 🎯 Only select necessary fields
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order with customer details:", error);
    res.status(500).json({ message: "Server error", error });
  }
});



// GET all orders
router.get('/successOrder/all',authMiddleware(["customer"]) , async (req, res) => {
  try {
    // Ensure user is authenticated and has admin role
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden access" });
    }

    console.log("Fetching all orders");

    const orders = await SuccessOrder.find()
      .populate("items.itemId") // populate details for product/prebuild
      .sort({ createdAt: -1 }); // most recent first

    console.log("Fetched orders:", orders);

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.stack); 
    res.status(500).json({ errorMessage: error.message });
  }
});


router.get('/successOrder/all',authMiddleware("customer") , async (req, res) => {
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
    console.error("Error fetching orders:", error.stack); 
    console.error(error); // Log the error for debugging
    res.status(500).json({ errorMessage: error.message });
  }
});

// PUT successorder
// router.put("/:id", async (req, res) => {
//   try {
//     const { status } = req.body;
//     const updatedOrder = await SuccessOrder.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.json(updatedOrder);
//   } catch (err) {
//     console.error("Update order error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.put('/admin/updatestatus/:id', authMiddleware("admin"), async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  try {
    const order = await SuccessOrder.findByIdAndUpdate(orderId, { status }, { new: true }).populate('customerId');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Fetch item details for invoice (name, price, quantity)
    const populatedItems = [];

    for (const item of order.items) {
      let itemDetails;

      if (item.itemType === 'Product') {
        itemDetails = await Product.findById(item.itemId);
      } else if (item.itemType === 'PreBuild') {
        itemDetails = await PreBuild.findById(item.itemId);
      }

      if (itemDetails) {
        populatedItems.push({
          name: `(${item.itemType}) - Category: ${itemDetails.category} | Description: ${itemDetails.description}`,
          price: itemDetails.price,
          quantity: item.quantity
        });
      }
    }

    // Send Email to customer about status update
    await sendEmail(
      order.customerId.email,
      `Your Order Status is now ${status}`,
      `We would like to inform you that your order status has been updated to: <strong style="color:rgb(78, 76, 175);">${status}</strong>.<br/>
      If you have any questions, feel free to contact us.`,
      { useTemplate: true }
    );

    // If status becomes "handedOver", create transaction and send invoice
    if (status === "handedOver") {
      // Create Transaction
      await Transaction.create({
        amount: order.totalAmount,
        type: 'Income',
        category: 'sales',
        description: "Income from customer order's"
      });

      // Create Invoice
      const newInvoice = new Invoice({
        customerName: order.customerId.name,
        items: populatedItems,
        totalAmount: order.totalAmount,
        status: 'Paid', // or 'Pending' if not yet paid
        date: new Date(),
      });

      const savedInvoice = await newInvoice.save();
      console.log('Invoice created automatically ✅');

      // Generate Invoice PDF
      if (!fs.existsSync('invoices')) {
        fs.mkdirSync('invoices');
      }
      const invoicePath = `invoices/invoice_${savedInvoice._id}.pdf`;

      createInvoicePDF(savedInvoice, invoicePath);

      // Small wait to make sure PDF is written
      setTimeout(async () => {
        // Send Email with Invoice PDF
        await sendEmail(
          order.customerId.email,
          `Your Invoice from Alpha IT Solutions`,
          `Thank you for your order! Please find attached your invoice.`,
          {
            attachments: [
              {
                filename: `invoice_${savedInvoice._id}.pdf`,
                path: invoicePath
              }
            ],
            useTemplate: false // or true if you want an HTML body
          }
        );

        // Optional: Delete the PDF after sending if you don't want to store it
        // fs.unlinkSync(invoicePath);
      }, 2000); // 2 seconds delay
    }

    res.json(order);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * 
 * routes used for product inventory stock count 
 * 
 * 
 * 
 * 
 * 
 * 
*/

router.get(
  "/my",
  authMiddleware(["customer"]),
  async (req, res) => {
    try {
      const orders = await SuccessOrder
        .find({ customerId: req.user._id })
        .populate("items.itemId", "description price image")
        .sort({ createdAt: -1 });

      if (!orders.length) {
        return res.status(404).json({ message: "No orders found for you." });
      }
      res.json(orders);
    } catch (err) {
      console.error("❌ GET /my SuccessOrders:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);
router.get('/admin/all', authMiddleware(["admin", "staff"]), async (req, res) => {
  try {
    const orders = await SuccessOrder.find()
      .populate({
        path: 'items.itemId',
        select: 'description category',
        strictPopulate: false, // ADD THIS (important for mongoose >=7)
      })
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No success orders found." });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all success orders:", error.stack);
    res.status(500).json({ errorMessage: error.message });
  }
});



// GET a single SuccessOrder by its ID
router.get('/single/:id', async (req, res) => {
  try {
    const successOrder = await SuccessOrder.findById(req.params.id)
      .populate('customerId', 'name email phoneNo');

    if (!successOrder) {
      return res.status(404).json({ message: "SuccessOrder not found" });
    }

    // Now also find related Order
    const relatedOrder = await Order.findOne({ SuccessorderId: successOrder._id });

    res.json({
      successOrder,
      relatedOrder,
    });
  } catch (error) {
    console.error("Error fetching single SuccessOrder:", error.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// 📊 Customer Inventory & Purchase Analytics
router.get('/analytics/me', authMiddleware(["customer"]), async (req, res) => {
  try {
    const customerId = req.user._id;

    const orders = await SuccessOrder.find({ customerId })
      .populate('items.itemId', 'description price')
      .sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for you." });
    }

    let totalSpent = 0;
    let totalOrders = orders.length;
    const productCounts = {};

    orders.forEach(order => {
      totalSpent += order.totalAmount;
      order.items.forEach(item => {
        const key = item.itemId?.description || item.itemId?._id?.toString() || "Unknown Product";
        productCounts[key] = (productCounts[key] || 0) + (item.quantity || 1);
      });
    });

    const topProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([product, count]) => ({ product, unitsPurchased: count }));

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentOrders = orders
      .filter(order => new Date(order.createdAt) > last7Days)
      .map(order => ({
        id: order._id,
        totalAmount: order.totalAmount,
        date: order.createdAt,
        items: order.items.map(it => ({
          description: it.itemId?.description || "Unknown",
          quantity: it.quantity
        }))
      }));

    res.json({
      totalOrders,
      totalSpent,
      topProducts,
      recentOrders,
      suggestion: topProducts.length
        ? `You seem to love ${topProducts[0].product}! Check out new arrivals.`
        : "Start shopping to get personalized suggestions!"
    });
  } catch (err) {
    console.error("❌ GET /analytics/me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});




export default router;
