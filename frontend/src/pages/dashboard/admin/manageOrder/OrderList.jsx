import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import "../../styles/order_dashboard.css";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/successorders/successorder/all", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [navigate]);

  useEffect(() => {
    const filtered = orders.filter((order) =>
      order.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setIsButtonDisabled(order.status !== "Pending");
  };

  const updateOrderStatus = async (status) => {
    try {
      setIsButtonDisabled(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/successorders/successorder/${selectedOrder._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();

      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );

      setFilteredOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating order:", error);
      setIsButtonDisabled(false);
    }
  };

  const handleGenerateFullReport = () => {
    const reportWindow = window.open("", "_blank");
  
    const tableRows = filteredOrders.map((order, index) => {
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${order.customerId}</td>
          <td>$${order.totalAmount.toFixed(2)}</td>
          <td>${order.status}</td>
          <td>${new Date(order.createdAt).toLocaleString()}</td>
        </tr>
      `;
    }).join("");
  
    const htmlContent = `
      <html>
        <head>
          <title>All Orders Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h2 {
              text-align: center;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 10px;
              border: 1px solid #ccc;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <h2>All Orders Report</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Customer ID</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `;
  
    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
    reportWindow.print();
  };
  

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>Success Order Management</h1>
        <input
          type="text"
          placeholder="Search by status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>

      <div>
        <button
          onClick={handleGenerateFullReport}
          style={{
            padding: "8px 16px",
            marginTop: "10px",
            backgroundColor: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Generate Full Report
        </button>
      </div>

      <div className="order-details">
        <h2>Orders</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer ID</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <tr key={order._id} onClick={() => handleRowClick(order)}>
                  <td>{index + 1}</td>
                  <td>{order.customerId}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Customer ID:</strong> {selectedOrder.customerId}</p>
              <p><strong>Total Amount:</strong> ${selectedOrder.totalAmount.toFixed(2)}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Created At:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>

              <div className="modal-actions" style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
              <button
                className="btn approve-btn"
                onClick={() => {
                  if (window.confirm("Are you sure you want to approve this order?")) {
                    updateOrderStatus("Approved");
                  }
                }}
                disabled={isButtonDisabled}
              style={{
                backgroundColor: isButtonDisabled ? "#ccc" : "#4CAF50",
                color: isButtonDisabled ? "#666" : "#fff",
                cursor: isButtonDisabled ? "not-allowed" : "pointer",
              }}
            >
              Approve
            </button>

            <button
              className="btn disapprove-btn"
              onClick={() => {
                if (window.confirm("Are you sure you want to cancel this order?")) {
                  updateOrderStatus("Cancelled");
                }
              }}
              disabled={isButtonDisabled}
              style={{
                backgroundColor: isButtonDisabled ? "#ccc" : "#f44336",
                color: isButtonDisabled ? "#666" : "#fff",
                cursor: isButtonDisabled ? "not-allowed" : "pointer",
              }}
            >
              Cancel
            </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;