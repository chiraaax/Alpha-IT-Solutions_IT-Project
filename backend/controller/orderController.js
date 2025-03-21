// import Order from "../models/OrderManagement/Order.js";

// export const placeOrder = async (req, res) => {
//   try {
//     console.log("Incoming order request:", req.body); // Log request

//     const { name, phoneNo, email, paymentMethod, address, deliveryDate, deliveryTime, pickupDate, pickupTime } = req.body;

//     if (!name || !phoneNo || !email || !paymentMethod) {
//       console.error("Missing required fields!");
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const order = new Order({
//       name,
//       phoneNo,
//       email,
//       paymentMethod,
//       address: paymentMethod === "COD" ? address : undefined,
//       deliveryDate: paymentMethod === "COD" ? deliveryDate : undefined,
//       deliveryTime: paymentMethod === "COD" ? deliveryTime : undefined,
//       pickupDate: paymentMethod === "Pickup" ? pickupDate : undefined,
//       pickupTime: paymentMethod === "Pickup" ? pickupTime : undefined,
//     });

//     await order.save();
//     console.log("Order saved:", order);
//     res.status(201).json({ message: "Order placed successfully!", order });

//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ message: "Failed to place order. Please check again." });
//   }
// };

// export const getAllOrders = async (req, res) => {
//   try {
//     const orderData = await Order.find();
//     if(!orderData || orderData.length === 0) {
//       return res.status(404).json({message:"Order data not found"});
//     }
//     return res.status(200).json(orderData);
//   } catch (error) {
//     return res.status(500).json({errorMessage:error.message});
//   }
// };

// export default placeOrder;