import { useState, useEffect } from "react";
import { useParams} from "react-router-dom";
import axios from "axios";
import "../../styles/OrderManagement/CheckoutForm.css";
import PickupForm from "./pickupForm";
import CodForm from "./CodForm";
import { deleteOrder, updateOrder } from "./orderService";

const CheckoutForm = () => {
  const { email } = useParams();
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

  const [successOrder, setSuccessOrder] = useState(null);

  // Fetch order details if orderId is provided
  useEffect(() => {
    if (email) {
      axios
        .get(`http://localhost:5000/api/orders/orders/${email}`)
        .then((response) => {
          const order = response.data;
          setSuccessOrder(order);
          setFormData({
            name: order.name,
            phoneNo: order.phoneNo,
            email: order.email,
            paymentMethod: order.paymentMethod,
          });

          if (order.paymentMethod === "COD") {
            setCodData({
              address: order.address,
              deliveryDate: order.deliveryDate,
              deliveryTime: order.deliveryTime,
              saveAddress: order.saveAddress || false,
            });
          } else {
            setPickupData({
              pickupDate: order.pickupDate,
              pickupTime: order.pickupTime,
            });
          }

          checkTimeLimit(order);
        })
        .catch((error) => {
          console.error("Error fetching order:", error);
        });
    }
  }, [email]);

  const checkTimeLimit = (order) => {
    if (!order) return;
    const orderTime = new Date(order.createdAt);
    const currentTime = new Date();
    const diffHours = (currentTime - orderTime) / (1000 * 60 * 60);
    setCanModify(diffHours <= 24);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCodChange = (e) => {
    setCodData({ ...codData, [e.target.name]: e.target.value });
  };

  const handlePickupChange = (e) => {
    setPickupData({ ...pickupData, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setFormData({ ...formData, paymentMethod: e.target.value });
  };
  const handleDelete = async () => {
    if (!formData.email) {
        alert("Order not found. Email is required.");
        return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
        const result = await deleteOrder(formData.email); // Use email instead of id
        alert(result.message || "Order deleted successfully!");

        // Clear state and navigate away
        setSuccessOrder(null);
        // navigate("/orders"); // Redirect to orders list
    } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order.");
    }
};
  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      ...formData,
      ...(formData.paymentMethod === "COD" ? codData : pickupData),
    };

    try {
      const response = await axios.post("http://localhost:5000/api/orders/orders", orderData);
      setSuccessOrder(response.data);
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      alert("Failed to place order. Please check your details and try again.");
    }
  };

  const handleUpdate = async (email) => {
    // if (!successOrder || !email) {
    //   alert("Order not found.");
    //   return;
    // }

    const confirmUpdate = window.confirm("Are you sure you want to update this order?");
    if (!confirmUpdate) return;

    const updatedOrderData = {
      ...formData,
      ...(formData.paymentMethod === "COD" ? codData : pickupData),
    };

    try {
      const result = await updateOrder(email, updatedOrderData); // Pass `email` instead of `id`
      alert(result.message || "Order updated successfully!");

      // Update local state with new data after updating
      setSuccessOrder({ ...successOrder, ...updatedOrderData });
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order.");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {!successOrder ? (
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
  
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            required
          />
  
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
  
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
  
          <button type="submit" className="order">
            Save and Place Order
          </button>
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
            <li><strong>Order Type:</strong> {formData.paymentMethod === "COD" ? "Cash On Delivery" : "Pickup (Self Collect)"}</li>
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
  
          {/* <button onClick={handleUpdate(email)}>Update</button> */}
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
  
      {successOrder && (
        <div className="order-details-container">
          <h2>Order Details</h2>
          <div className="order-info">
            <div className="order-info-row">
              <strong>Name:</strong>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="order-info-row">
              <strong>Phone Number:</strong>
              <input type="text" name="phoneNo" value={formData.phoneNo} onChange={handleChange} />
            </div>
            <div className="order-info-row">
              <strong>Email:</strong>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="order-info-row">
              <strong>Payment Method:</strong>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handlePaymentChange}>
                <option value="COD">Cash On Delivery</option>
                <option value="Pickup">Pick-Up (Self Collect)</option>
              </select>
            </div>
            {formData.paymentMethod === "COD" && (
              <>
                <div className="order-info-row">
                  <strong>Delivery Address:</strong>
                  <input type="text" name="address" value={codData.address} onChange={handleCodChange} />
                </div>
                <div className="order-info-row">
                  <strong>Delivery Date:</strong>
                  <input type="date" name="deliveryDate" value={codData.deliveryDate} onChange={handleCodChange} />
                </div>
                <div className="order-info-row">
                  <strong>Delivery Time:</strong>
                  <input type="time" name="deliveryTime" value={codData.deliveryTime} onChange={handleCodChange} />
                </div>
              </>
            )}
            {formData.paymentMethod === "Pickup" && (
              <>
                <div className="order-info-row">
                  <strong>Pickup Date:</strong>
                  <input type="date" name="pickupDate" value={pickupData.pickupDate} onChange={handlePickupChange} />
                </div>
                <div className="order-info-row">
                  <strong>Pickup Time:</strong>
                  <input type="time" name="pickupTime" value={pickupData.pickupTime} onChange={handlePickupChange} />
                </div>
              </>
            )}
            <div className="button-group">
            <button onClick={() => handleUpdate(formData.email)}>Save Changes</button>
              {/* <button className="cancel-button" onClick={() => navigate("/checkoutForm")}>Cancel</button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
