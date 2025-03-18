import { useState } from "react";
import axios from "axios";
import "../../styles/OrderManagement/CheckoutForm.css";
import PickupForm from "./pickupForm";
import CodForm from "./CodForm";

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    name: "", // Changed from fullName to match backend schema
    phoneNo: "", // Changed from phoneNumber
    email: "",
    paymentMethod: "COD", // Adjusted to match backend enum ("COD" instead of "Cash On Delivery")
  });

  const [codData, setCodData] = useState({
    address: "",  
    deliveryDate: "",
    deliveryTime: "",
    saveAddress: false, // Included optional saveAddress field
  });

  const [pickupData, setPickupData] = useState({
    pickupDate: "",
    pickupTime: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCodChange = (e) => {
    setCodData({ ...codData, [e.target.name]: e.target.value });
  };

  const handlePickupChange = (e) => {
    setPickupData({ ...pickupData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      ...formData,
      ...(formData.paymentMethod === "COD" ? codData : pickupData),
    };

    console.log("Order data being sent to backend:", orderData);

    try {                                       
      const response = await axios.post("http://localhost:5000/api/orders/orders", orderData);
      alert("Order placed successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      alert("Failed to place order. Please check your details and try again.");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Phone Number</label>
        <input type="text" name="phoneNo" value={formData.phoneNo} onChange={handleChange} required />

        <label>Email Address</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <h3>Payment Options</h3>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={formData.paymentMethod === "COD"}
            onChange={handleChange}
          />
          Cash On Delivery
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="Pickup"
            checked={formData.paymentMethod === "Pickup"}
            onChange={handleChange}
          />
          Pick-Up (Self Collect)
        </label>

        {formData.paymentMethod === "Pickup" && (
          <PickupForm pickupData={pickupData} handlePickupChange={handlePickupChange} />
        )}
        {formData.paymentMethod === "COD" && (
          <CodForm codData={codData} handleCodChange={handleCodChange} />
        )}

        <button type="submit" className="order">Save and Place Order</button>
      </form>
    </div>
  );
};

export default CheckoutForm;
