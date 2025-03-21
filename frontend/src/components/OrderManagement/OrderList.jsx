import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderList = ({ customerId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/register${customerId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  return (
    <div>
      <h2>Your Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <strong>Order ID:</strong> {order._id} <br />
              <strong>Order Type:</strong> {order.paymentMethod === "COD" ? "Cash On Delivery" : "Pickup (Self Collect)"} <br />
              <strong>Total Amount:</strong> ${order.totalAmount} <br />
              <strong>Order Status:</strong> {order.status} <br />
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderList;
