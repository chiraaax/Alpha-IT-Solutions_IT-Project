import mongoose from "mongoose";

const PickupOrderSchema = new mongoose.Schema({
    name: String,
    phone: String,
    pickupDate: String,
    pickupTime: String,
    location: Object,
  });
  
const PickupOrder = mongoose.model("PickupOrder", PickupOrderSchema);
export default PickupOrder;