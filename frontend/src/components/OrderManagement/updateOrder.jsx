import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateOrder = () => {
  const { id } = useParams();
  // const id = typeof orderid === "object" ? orderid.id : id;
  console.log(`Order ID:${id}`);
  const navigate = useNavigate();

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

  useEffect(() => {
    // if (!id) {
    //   console.error('Order ID is missing');
    //   return;
    // }
    axios
      .get(`http://localhost:5000/api/orders/orders/${id}`)
      .then((response) => {
        const order = response.data;
        setFormData({
          name: order.name || "" ,
          phoneNo: order.phoneNo || "",
          email: order.email || "",
          paymentMethod: order.paymentMethod || "COD",
        });

        if (order.paymentMethod === "COD") {
          setCodData({
            address: order.address || "",
            deliveryDate: order.deliveryDate || "",
            deliveryTime: order.deliveryTime || "",
            saveAddress: order.saveAddress || false,
          });
        } else {
          setPickupData({
            pickupDate: order.pickupDate || "",
            pickupTime: order.pickupTime || "",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching order:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCODChange = (e) => {
    setCodData({ ...codData, [e.target.name]: e.target.value });
  };

  const handlePickupChange = (e) => {
    setPickupData({ ...pickupData, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setFormData({ ...formData, paymentMethod: e.target.value });
  };

  const handleSave = () => {
    const updatedOrder = {
      ...formData,
      ...(formData.paymentMethod === "COD" ? codData : pickupData),
    };

    axios
      .put(`http://localhost:5000/api/orders/orders/${id}`, updatedOrder)
      .then(() => {
        alert("Order updated successfully!");
        // navigate(`orders/${id}`);
      })
      .catch((error) => {
        console.error("Error updating order:", error);
        alert("Failed to update order.");
      });
  };

  console.log("Form Data:", formData);
  console.log("COD Data:", codData);
  console.log("Pickup Data:", pickupData);

  return (
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
              <input type="text" name="address" value={codData.address} onChange={handleCODChange} />
            </div>
            <div className="order-info-row">
              <strong>Delivery Date:</strong>
              <input type="date" name="deliveryDate" value={codData.deliveryDate} onChange={handleCODChange} />
            </div>
            <div className="order-info-row">
              <strong>Delivery Time:</strong>
              <input type="time" name="deliveryTime" value={codData.deliveryTime} onChange={handleCODChange} />
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
          <button className="save-button" onClick={handleSave}>Save Changes</button>
          <button className="cancel-button" onClick={() => navigate("/checkoutForm")}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrder;
