// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   phoneNo: { type: String, required: true },
//   email: { type: String, required: true },
//   paymentMethod: { type: String, required: true },
//   address: { type: String },  // For COD
//   date: { type: String },     // For COD
//   time: { type: String },     // For COD
//   pickupDate: { type: String },  // For Pickup
//   pickupTime: { type: String },  // For Pickup
//   saveAddress: { type: Boolean, default: false },
// });

// const Order = mongoose.model("Order", orderSchema);
// export default Order;


import mongoose from "mongoose";

const codSchema = new mongoose.Schema({
  address: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  deliveryTime: { type: String, required: true },
});

const pickupSchema = new mongoose.Schema({
  pickupDate: { type: Date, required: true },
  pickupTime: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
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
