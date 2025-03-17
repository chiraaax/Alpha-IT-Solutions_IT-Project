// import { useState, useEffect } from "react";

// const CodForm = ({ orderId, onSubmit }) => {
//     const [address, setAddress] = useState("");
//     const [date, setDate] = useState("");
//     const [time, setTime] = useState("");
//     const [saveAddress, setSaveAddress] = useState(false);
//     const [savedAddresses, setSavedAddresses] = useState([]);

//     // Fetch previously saved addresses
//     useEffect(() => {
//         fetch(`/api/address/${orderId}`)
//             .then(res => res.json())
//             .then(data => setSavedAddresses(data))
//             .catch(err => console.error(err));
//     }, [orderId]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const codorderData = { orderId, addressId, date, time, saveAddress };

//         try {
//             const response = await fetch("http://localhost:5000/api/codOrders", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(codorderData),
//             });

//             if (response.ok) {
//                 alert("Order placed successfully!");
//                 onSubmit();
//             } else {
//                 alert("Failed to place order.");
//             }
//         } catch (error) {
//             console.error("Error:", error);
//         }
//     };

//     return (
//         <div>
//             <h2>Cash on Delivery</h2>
//             <form onSubmit={handleSubmit}>
//                 <label>Choose a saved address:</label>
//                 <select onChange={(e) => setAddress(e.target.value)}>
//                     <option value="">Enter new address</option>
//                     {savedAddresses.map((addr, index) => (
//                         <option key={index} value={addr}>{addr}</option>
//                     ))}
//                 </select>

//                 <label>Enter New Address:</label>
//                 <textarea value={address} onChange={(e) => setAddress(e.target.value)} required />

//                 <label>Delivery Date:</label>
//                 <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

//                 <label>Delivery Time:</label>
//                 <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />

//                 <label>
//                     <input type="checkbox" checked={saveAddress} onChange={() => setSaveAddress(!saveAddress)} />
//                     Save this address for future use
//                 </label>

//                 <button type="submit">Confirm Order</button>
//             </form>
//         </div>
//     );
// };

// export default CodForm;
import React from "react";

const CodForm = ({ codData, handleCodChange }) => {
  return (
    <div className="cod-form">
      <h4>Cash On Delivery (COD) Details</h4>
      <label>Address</label>
      <input
        type="text"
        name="address"
        value={codData.address}
        onChange={handleCodChange}
        required
      />

      <label>Pickup Date</label>
      <input
        type="date"
        name="date"
        value={codData.date}
        onChange={handleCodChange}
        required
      />

      <label>Pickup Time</label>
      <input
        type="time"
        name="time"
        value={codData.time}
        onChange={handleCodChange}
        required
      />
    </div>
  );
};

export default CodForm;

