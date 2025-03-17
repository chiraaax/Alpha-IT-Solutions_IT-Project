import Order from "../models/OrderManagement/Order.js";

export const placeOrder = async (req, res) => {
  try {
    console.log("🔹 Incoming order request:", req.body); // Log request

    const { name, phoneNo, email, paymentMethod, address, date, time, pickupDate, pickupTime } = req.body;

    if (!name || !phoneNo || !email || !paymentMethod) {
      console.error("⚠️ Missing required fields!");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = new Order({
      name,
      phoneNo,
      email,
      paymentMethod,
      address: paymentMethod === "Cash On Delivery" ? address : undefined,
      date: paymentMethod === "Cash On Delivery" ? date : undefined,
      time: paymentMethod === "Cash On Delivery" ? time : undefined,
      pickupDate: paymentMethod === "Pick-Up(Self Collect)" ? pickupDate : undefined,
      pickupTime: paymentMethod === "Pick-Up(Self Collect)" ? pickupTime : undefined,
    });

    await order.save();
    console.log("✅ Order saved:", order);
    res.status(201).json({ message: "Order placed successfully!", order });

  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ message: "Failed to place order. Please check again." });
  }
};


export default placeOrder;