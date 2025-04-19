import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/orders";

// Delete an order by ID
export const deleteOrder = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete order failed:", error.response?.data || error.message);
    throw error;
  }
};

// Update an order by ID
export const updateOrder = async (id, updatedOrderData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, updatedOrderData);
    return response.data;
  } catch (error) {
    console.error("Update order failed:", error.response?.data || error.message);
    throw error;
  }
};


// export const deleteOrder = async (id) => {
//   try {
//     console.log("Sending DELETE request for order ID:", id);

//     // const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
//     //   method: "DELETE",
//     //   headers: { "Content-Type": "application/json" },
//     // });

//     const res = await axios.delete(`http://localhost:5000/api/orders/${id}`);

//     if (!res.ok) {
//       const errorText = await res.text();
//       console.error("Server response:", errorText);
//       throw new Error(`Failed to delete order: ${res.statusText}`);
//     }

//     const result = await res.json();
//     return result;
//   } catch (error) {
//     console.error("Error deleting order:", error);
//     return { message: "Error deleting order" };
//   }
// };

// export const updateOrder = async (id, updatedData) => {
//   if (!id) {
//     console.error("Order ID is missing in updateOrder function");
//     return;
//   }

//   try {
//     const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(updatedData),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Server response:", errorText);
//       throw new Error(`Failed to update order: ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error updating order:", error);
//     return { message: "Error updating order" };
//   }
// };
