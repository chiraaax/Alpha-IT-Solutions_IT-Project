// import express from "express";
// const router = express.Router();
// import PickupOrder from "../../models/OrderManagement/PickupOrder.js";

// // Place Pickup Order
// router.post("/", async (req, res) => {
//     try {
//         const { orderType, pickupDate, pickupTime } = req.body;

//         if (!pickupDate || !pickupTime) {
//             return res.status(400).json({ error: "Pickup date and time are required" });
//         }

//         const newOrder = new PickupOrder({ orderType, pickupDate, pickupTime });
//         await newOrder.save();
        
//         res.json({ success: true, message: "Pickup order placed successfully" });
//     } catch (error) {
//         res.status(500).json({ error: "Server error" });
//     }
// });

// export default router;
