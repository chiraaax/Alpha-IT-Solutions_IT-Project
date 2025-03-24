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

              <div className="modal-actions" style={{ marginTop: "12px" }}>
                <button
                  className="btn approve-btn"
                  onClick={() => updateOrderStatus("Approved")}
                  disabled={isButtonDisabled}
                  style={{
                    backgroundColor: isButtonDisabled ? "#ccc" : "#4CAF50",
                    color: isButtonDisabled ? "#666" : "#fff",
                    cursor: isButtonDisabled ? "not-allowed" : "pointer",
                  }}
                >
                  Approve
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


// import React, { useEffect, useState } from 'react';
// // import { useParams } from "react-router-dom";
// import axios from 'axios';

// const OrderList = () => {
//   // const {id} = useParams();
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     axios.get('api/successorders/successorder/all')
//       .then(res => {
//         const data = res.data;
//         console.log("Orders Response:", data);
//         if (Array.isArray(data)) {
//           setOrders(data);
//         } else if (Array.isArray(data.orders)) {
//           setOrders(data.orders);
//         } else {
//           setOrders([]); // fallback
//         }
//       })
//       .catch(err => {
//         console.error("Error fetching orders:", err);
//         setOrders([]);
//       });
//   }, []);
  
// //   useEffect(() => {
// //     axios.get('/api//successorder/:id')
// //       .then(res => setOrders(res.data))
// //       .catch(err => console.error(err));
// //   }, []);

//   const handleApprove = async (id) => {
//     try {
//       const res = await axios.put(`api/successorders/successorder/${id}`);
//       setOrders(prevOrders =>
//         prevOrders.map(order =>
//           order._id === id ? { ...order, status: res.data.status } : order
//         )
//       );
//     } catch (err) {
//       console.error('Error approving order:', err);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 style={{ color: 'white', marginBottom: '1rem' }}>Success Orders</h2>
//       <table style={{ width: '100%', backgroundColor: '#000', color: '#fff', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr>
//             <th style={{ padding: '10px', borderBottom: '1px solid #555' }}>Customer</th>
//             <th style={{ padding: '10px', borderBottom: '1px solid #555' }}>Total</th>
//             <th style={{ padding: '10px', borderBottom: '1px solid #555' }}>Status</th>
//             <th style={{ padding: '10px', borderBottom: '1px solid #555' }}>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map(order => (
//             <tr key={order._id}>
//               <td style={{ padding: '10px', borderBottom: '1px solid #333' }}>
//                 {order.customerId?.name || 'N/A'}
//               </td>
//               <td style={{ padding: '10px', borderBottom: '1px solid #333' }}>
//                 ${order.totalAmount}
//               </td>
//               <td style={{ padding: '10px', borderBottom: '1px solid #333' }}>
//                 {order.status}
//               </td>
//               <td style={{ padding: '10px', borderBottom: '1px solid #333' }}>
//                 {order.status === 'Pending' && (
//                   <button
//                     style={{
//                       backgroundColor: '#007bff',
//                       color: 'white',
//                       padding: '6px 12px',
//                       border: 'none',
//                       borderRadius: '5px',
//                       cursor: 'pointer'
//                     }}
//                     onClick={() => handleApprove(order._id)}
//                   >
//                     Approve
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default OrderList;
