import React from "react";
import "../../styles/OrderManagement/CodForm.css";

const CodForm = ({ codData, handleCodChange }) => {
  return (
    <div className="cod-form">
      <h4>Cash On Delivery (COD) Details</h4>
      
      <div className="form-group">
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={codData.address}
          onChange={handleCodChange}
          required
          placeholder="Enter delivery address"
        />
      </div>

      <div className="form-group">
        <label>Pickup Date</label>
        <input
          type="date"
          name="deliveryDate"
          value={codData.deliveryDate}
          onChange={handleCodChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Pickup Time</label>
        <input
          type="time"
          name="deliveryTime"
          value={codData.deliveryTime}
          onChange={handleCodChange}
          required
        />
      </div>
    </div>
  );
};

export default CodForm;
