import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/OrderManagement/CheckoutForm.css";
import PickupForm from "./pickupForm";
import CodForm from "./CodForm";
import { deleteOrder/*, updateOrder*/ } from "./orderService";

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
  // const [canModify, setCanModify] = useState(false);

  // Fetch order details if orderId is provided
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/orders/orders/${id}`)
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
  }, [id]);

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

  // const handleUpdate = async () => {
  //   if (!successOrder) {
  //     alert("Order not found.");
  //     return;
  //   }

  //   const updatedOrderData = {
  //     ...formData,
  //     ...(formData.paymentMethod === "COD" ? codData : pickupData),
  //   };

  //   try {
  //     const result = await updateOrder(successOrder, updatedOrderData);
  //     alert(result.message || "Order updated successfully!");

  //     // Update local state with new data after updating
  //     setSuccessOrder({ ...successOrder, ...updatedOrderData });
  //   } catch (error) {
  //     console.error("Error updating order:", error);
  //     alert("Failed to update order.");
  //   }
  // };

  // console.log("order ID : " , id);
  const handleDelete = async () => {
    if (!id) {
      alert("Order not found.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;
  

    try {
      const result = await deleteOrder(id);
      alert(result.message);

      // Clear order data after deletion
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
      // navigate(`/checkout/${response.data.id}`);
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
            {console.log(id)}
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

          <button onClick={() => navigate(`/updateOrder/${id}`)}>Update</button>
          {/* <button onClick={handleUpdate}>Update</button> */}
          <button onClick={handleDelete}>Delete</button>

          {/* {canModify && (
            <>
              <button onClick={handleUpdate}>Update</button>
              <button onClick={handleDelete}>Delete</button>
            </>
          )} */}
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
