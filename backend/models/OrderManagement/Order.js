import mongoose from "mongoose";

const codSchema = new mongoose.Schema({
  address: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  deliveryTime: { type: String,enum: [
    "9:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM",
  ], required: true },
});

const pickupSchema = new mongoose.Schema({
  pickupDate: { type: Date, required: true },
  pickupTime: { type: String,enum: [
    "9:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM",
  ], required: true },
});

const orderSchema = new mongoose.Schema({
  SuccessorderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "SuccessOrder", 
      required: true 
    },
  customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  name: { type: String, required: true },
  phoneNo: { type: String, required: true },
  email: { type: String, required: true },
  paymentMethod: { type: String, enum: ["COD", "Pickup"], required: true },
  codDetails: { type: codSchema, required: function () { return this.paymentMethod === "COD"; } },
  pickupDetails: { type: pickupSchema, required: function () { return this.paymentMethod === "Pickup"; } },
  saveAddress: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
