import React from "react";
import "../../styles/OrderManagement/PickupForm.css"; // Make sure to create this CSS file

const PickupForm = ({ pickupData, handlePickupChange }) => {
  return (
    <div className="pickup-form">
      <h4>Pick-Up (Self Collect) Details</h4>

      <div className="form-group">
        <label>Pickup Date</label>
        <input
          type="date"
          name="pickupDate"
          value={pickupData.pickupDate}
          onChange={handlePickupChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Pickup Time</label>
        <input
          type="time"
          name="pickupTime"
          value={pickupData.pickupTime}
          onChange={handlePickupChange}
          required
        />
      </div>
    </div>
  );
};

export default PickupForm;
