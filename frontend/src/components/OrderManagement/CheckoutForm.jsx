import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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
      const result = await deleteOrder(formData.email);
      alert(result.message || "Order deleted successfully!");
      setSuccessOrder(null);
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
    const confirmUpdate = window.confirm("Are you sure you want to update this order?");
    if (!confirmUpdate) return;

    const updatedOrderData = {
      ...formData,
      ...(formData.paymentMethod === "COD" ? codData : pickupData),
    };

    try {
      const result = await updateOrder(email, updatedOrderData);
      alert(result.message || "Order updated successfully!");
      setSuccessOrder({ ...successOrder, ...updatedOrderData });
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order.");
    }
  };

  return (
    <div style={{ width: "50%", margin: "50px auto", padding: "20px", background: "#d9e2ee", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center" }}>Checkout</h2>
      {!successOrder ? (
        <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
          <label style={{ fontSize: "16px", fontWeight: "bold", marginTop: "10px", display: "block" }}>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ margin: "5px 0 15px 0", padding: "10px", fontSize: "16px", border: "1px solid #000000", borderRadius: "5px" }}
          />

          <label style={{ fontSize: "16px", fontWeight: "bold", marginTop: "10px", display: "block" }}>Phone Number</label>
          <input
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            required
            style={{ margin: "5px 0 15px 0", padding: "10px", fontSize: "16px", border: "1px solid #000000", borderRadius: "5px" }}
          />

          <label style={{ fontSize: "16px", fontWeight: "bold", marginTop: "10px", display: "block" }}>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ margin: "5px 0 15px 0", padding: "10px", fontSize: "16px", border: "1px solid #000000", borderRadius: "5px" }}
          />

          <h3 style={{ textAlign: "center" }}>Payment Options</h3>
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

          <button
            type="submit"
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              width: "fit-content",
              alignSelf: "center",
              background: "rgb(2, 209, 2)",
              color: "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "background 0.3s, color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "darkgreen")}
            onMouseOut={(e) => (e.target.style.background = "rgb(2, 209, 2)")}
          >
            Save and Place Order
          </button>
        </form>
      ) : (
        <div style={{ marginTop: "16px", padding: "16px", border: "1px solid #000000", borderRadius: "8px", background: "#d1f7d1" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#145214" }}>Order Successfully Placed!</h3>
          <p>Thank you for your order. Here are the details:</p>
          <ul style={{ marginTop: "8px", listStyleType: "disc", paddingLeft: "20px" }}>
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

          <button onClick={handleDelete}>Delete</button>
        </div>
      )}

      {successOrder && (
        <div style={{ marginTop: "20px" }}>
          <h2>Order Details</h2>
          <div>
            <div style={{ marginBottom: "10px" }}>
              <strong>Name:</strong>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{ marginLeft: "10px", padding: "5px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <strong>Phone Number:</strong>
              <input
                type="text"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                style={{ marginLeft: "10px", padding: "5px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <strong>Email:</strong>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ marginLeft: "10px", padding: "5px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <strong>Payment Method:</strong>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handlePaymentChange}
                style={{ marginLeft: "10px", padding: "5px" }}
              >
                <option value="COD">Cash On Delivery</option>
                <option value="Pickup">Pick-Up (Self Collect)</option>
              </select>
            </div>
            {formData.paymentMethod === "COD" && (
              <>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Delivery Address:</strong>
                  <input
                    type="text"
                    name="address"
                    value={codData.address}
                    onChange={handleCodChange}
                    style={{ marginLeft: "10px", padding: "5px" }}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Delivery Date:</strong>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={codData.deliveryDate}
                    onChange={handleCodChange}
                    style={{ marginLeft: "10px", padding: "5px" }}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Delivery Time:</strong>
                  <input
                    type="time"
                    name="deliveryTime"
                    value={codData.deliveryTime}
                    onChange={handleCodChange}
                    style={{ marginLeft: "10px", padding: "5px" }}
                  />
                </div>
              </>
            )}
            {formData.paymentMethod === "Pickup" && (
              <>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Pickup Date:</strong>
                  <input
                    type="date"
                    name="pickupDate"
                    value={pickupData.pickupDate}
                    onChange={handlePickupChange}
                    style={{ marginLeft: "10px", padding: "5px" }}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Pickup Time:</strong>
                  <input
                    type="time"
                    name="pickupTime"
                    value={pickupData.pickupTime}
                    onChange={handlePickupChange}
                    style={{ marginLeft: "10px", padding: "5px" }}
                  />
                </div>
              </>
            )}
            <div>
              <button onClick={() => handleUpdate(formData.email)}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;