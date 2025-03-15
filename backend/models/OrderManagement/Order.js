import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  fullName: String,
  phoneNumber: String,
  email: String,
  paymentMethod: String,
  date: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;