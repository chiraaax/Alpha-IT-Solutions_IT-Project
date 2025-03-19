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
        name="deliveryDate"
        value={codData.deliveryDate}
        onChange={handleCodChange}
        required
      />

      <label>Pickup Time</label>
      <input
        type="time"
        name="deliveryTime"
        value={codData.deliveryTime}
        onChange={handleCodChange}
        required
      />
    </div>
  );
};

export default CodForm;