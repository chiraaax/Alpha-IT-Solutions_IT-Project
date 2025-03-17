// import express from "express";
// import codOrder from "../../models/OrderManagement/codOrder.js";
// import Address from "../../models/OrderManagement/Address.js";
// const router = express.Router();

// // Handle COD order
// router.post("/cod", async (req, res) => {
//     const { orderId, addressId, date, time, saveAddress } = req.body;

//     try {
//         // Save order in database
//         const newOrder = new codOrder({ orderId, addressId, date, time, paymentMethod: "COD" });
//         await newOrder.save();

//         // Save address if user opted in
//         if (saveAddress) {
//             const existingAddress = await Address.findOne({ userId });
//             if (existingAddress) {
//                 existingAddress.addresses.push(address);
//                 await existingAddress.save();
//             } else {
//                 const newAddress = new Address({ userId, addresses: [address] });
//                 await newAddress.save();
//             }
//         }

//         res.status(201).json({ message: "Order placed successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// export default router; 