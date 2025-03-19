import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/OrderManagement/CheckoutForm.css";
import PickupForm from "./pickupForm";
import CodForm from "./CodForm";

const CheckoutForm = () => {
  const { orderId } = useParams();
  
  // Form data for order submission
  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    email: "",
    paymentMethod: "COD",
  });

  const [codData, setCodData] = useState({
    address: "",
    deliveryDate: "",
    deliveryTime: "",
    saveAddress: false,
  });

  const [pickupData, setPickupData] = useState({
    pickupDate: "",
    pickupTime: "",
  });

  // Store successfully placed order details
  const [successOrder, setSuccessOrder] = useState(null);

  // Fetch order details if orderId is provided
  useEffect(() => {
    if (orderId) {
      axios
        .get(`http://localhost:5000/api/orders/orders/${orderId}`)
        .then((response) => {
          const successOrder = response.data;
          setFormData({
            name: successOrder.name,
            phoneNo: successOrder.phoneNo,
            email: successOrder.email,
            paymentMethod: successOrder.paymentMethod,
          });

          if (successOrder.paymentMethod === "COD") {
            setCodData({
              address: successOrder.address,
              deliveryDate: successOrder.deliveryDate,
              deliveryTime: successOrder.deliveryTime,
              saveAddress: successOrder.saveAddress || false,
            });
          } else {
            setPickupData({
              pickupDate: successOrder.pickupDate,
              pickupTime: successOrder.pickupTime,
            });
          }
          // console.log("Success Order Data:", successOrder);
        })
        .catch((error) => {
          console.error("Error fetching order:", error);
        });
    }
  }, [orderId]);

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
      
      // Store the order details for success message display
      setSuccessOrder(response.data);

      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      alert("Failed to place order. Please check your details and try again.");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      
      {!successOrder ? (
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
      ) : (
        // Success Message with Order Details
        
        <div className="mt-4 p-4 border rounded-lg bg-green-100">
          <h3 className="text-lg font-semibold text-green-700">
            Order Successfully Placed!
          </h3>
          <p>Thank you for your order. Here are the details:</p>
          <ul className="mt-2 list-disc pl-5">
            <li><strong>Name:</strong> {formData.name}</li>
            <li><strong>Phone No:</strong> {formData.phoneNo}</li>
            <li><strong>Email:</strong> {formData.email}</li>
            <li><strong>Order Type:</strong> {formData.paymentMethod === 'COD' ? 'Cash On Delivery' : 'Pickup (Self Collect)'}</li><br />
            {formData.paymentMethod === "COD" && (
              <>
                <li><strong>Address:</strong> {codData.address}</li>
                <li><strong>Delivery Date:</strong> {codData.deliveryDate}</li>
                <li><strong>Delivery Time:</strong> {codData.deliveryTime}</li>
              </>
            )}
            {formData.paymentMethod === "Pickup" && (
              <>
                <li><strong>Pickup Date:</strong> {pickupData.pickupDate}</li>
                <li><strong>Pickup Time:</strong> {pickupData.pickupTime}</li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
