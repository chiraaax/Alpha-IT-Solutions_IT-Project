import mongoose from "mongoose";

const SuccessOrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Cancelled", "handedOver"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

const SuccessOrder = mongoose.models.SuccessOrder || mongoose.model("SuccessOrder", SuccessOrderSchema);
export default SuccessOrder;