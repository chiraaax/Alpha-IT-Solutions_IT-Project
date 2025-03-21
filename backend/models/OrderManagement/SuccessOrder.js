import mongoose from "mongoose";

const SuccessOrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  paymentMethod: { type: String, enum: ["COD", "Pickup"], required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Cancelled", "handovered"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

const SuccessOrder = mongoose.models.Order || mongoose.model("SuccessOrder", SuccessOrderSchema);
export default SuccessOrder;
