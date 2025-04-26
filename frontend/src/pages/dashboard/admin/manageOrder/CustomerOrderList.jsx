import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomerOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/orders/all", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch customer orders");

        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error("Error fetching customer orders:", error);
      }
    };

    fetchOrders();
  }, [navigate]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = orders.filter((order) =>
      order.name.toLowerCase().includes(query) ||
      order.paymentMethod.toLowerCase().includes(query)
    );
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const handleGenerateReport = () => {
    const reportWindow = window.open("", "_blank");

    const rows = filteredOrders.map((order, index) => {
      const cod = order.codDetails || {};
      const pickup = order.pickupDetails || {};

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${order.name}</td>
          <td>${order.email}</td>
          <td>${order.phoneNo}</td>
          <td>${order.paymentMethod}</td>
          <td>${order.paymentMethod === "COD" ? cod.address : "-"}</td>
          <td>${order.paymentMethod === "COD" ? new Date(cod.deliveryDate).toLocaleDateString() : new Date(pickup.pickupDate).toLocaleDateString()}</td>
          <td>${order.paymentMethod === "COD" ? cod.deliveryTime : pickup.pickupTime}</td>
          <td>${new Date(order.createdAt).toLocaleString()}</td>
        </tr>
      `;
    }).join("");

    const html = `
      <html>
        <head>
          <title>Customer Orders Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; border: 1px solid #ccc; }
            th { background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <h2>Customer Orders Report</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Method</th>
                <th>Address</th>
                <th>Date</th>
                <th>Time</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    reportWindow.document.write(html);
    reportWindow.document.close();
    reportWindow.print();
  };

  const handleOrderClick = (orderId) => {
    navigate(`/dashboard/SuccessOrder/${orderId}`);
  };
  

  return (
    <div className="dashboard-container">
      <h1>Customer Orders</h1>

      <input
        type="text"
        placeholder="Search by name or method..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
        style={{ marginBottom: "10px", padding: "8px", width: "300px" }}
      />

      <button
        onClick={handleGenerateReport}
        style={{
          padding: "8px 16px",
          marginBottom: "15px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Generate Report
      </button>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Payment Method</th>
            <th>Address</th>
            <th>Date</th>
            <th>Time</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => {
              const cod = order.codDetails || {};
              const pickup = order.pickupDetails || {};

              return (
                <tr key={order._id} 
                onClick={() => handleOrderClick(order.SuccessorderId)}
                style={{ cursor: "pointer" }}>
                  <td>{index + 1}</td>
                  <td>{order.name}</td>
                  <td>{order.email}</td>
                  <td>{order.phoneNo}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.paymentMethod === "COD" ? cod.address : "-"}</td>
                  <td>
                    {order.paymentMethod === "COD"
                      ? new Date(cod.deliveryDate).toLocaleDateString()
                      : new Date(pickup.pickupDate).toLocaleDateString()}
                  </td>
                  <td>
                    {order.paymentMethod === "COD"
                      ? cod.deliveryTime
                      : pickup.pickupTime}
                  </td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerOrderList;
