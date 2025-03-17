// import express from "express";
// import Address from "../../models/OrderManagement/Address.js";
// const router = express.Router();

// // Get saved addresses
// router.get("/:userId", async (req, res) => {
//     try {
//         const addressData = await Address.findOne({ userId: req.params.userId });
//         if (addressData) {
//             res.json(addressData.addresses);
//         } else {
//             res.json([]);
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// export default router; 