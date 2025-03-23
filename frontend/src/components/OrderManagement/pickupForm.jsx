import React from "react";

const PickupForm = ({ pickupData, handlePickupChange }) => {
  return (
    <div className="pickup-form">
      <h4>Pick-Up (Self Collect) Details</h4>
      <label>Pickup Date</label>
      <input
        type="date"
        name="pickupDate"
        value={pickupData.pickupDate}
        onChange={handlePickupChange}
        required
      />

      <label>Pickup Time</label>
      <input
        type="time"
        name="pickupTime"
        value={pickupData.pickupTime}
        onChange={handlePickupChange}
        required
      />
    </div>
  );
};

export default PickupForm;
