import { useState } from "react";
import axios from "axios";
import "../../styles/OrderManagement/CheckoutForm.css";
import PickupForm from "./pickupForm";

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    paymentMethod: "Cash On Delivery",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/orders", formData);
      alert("Order placed successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />

        <label>Phone Number</label>
        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />

        <label>Email Address</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <h3>Payment Options</h3>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="Cash On Delivery"
            id="cod-option"
            checked={formData.paymentMethod === "Cash On Delivery"}
            onChange={handleChange}
          />
          Cash On Delivery
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="Pick-Up(Self Collect)"
            id="pickup-option"
            checked={formData.paymentMethod === "Pick-Up(Self Collect)"}
            onChange={handleChange}
          />
          Pick-Up (Self Collect)
        </label>

        {formData.paymentMethod === "Pick-Up(Self Collect)" && <PickupForm />}


        <button type="submit" class="order">Save and Place Order</button>
      </form>
    </div>
  );
};

export default CheckoutForm;
