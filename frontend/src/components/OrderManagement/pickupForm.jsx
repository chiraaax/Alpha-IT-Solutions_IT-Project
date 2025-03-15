import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

const PickupForm = () => {
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const companyLocation = { lat: 7.2906, lng: 80.6337 }; // Change to your actual location

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      name,
      phone,
      pickupDate,
      pickupTime,
      location: companyLocation,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/pickup-orders", orderData);
      alert("Pickup order placed successfully!");
    } catch (error) {
      console.error("Error placing order", error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Schedule Your Pickup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={pickupDate}
          onChange={(e) => setPickupDate(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="time"
          value={pickupTime}
          onChange={(e) => setPickupTime(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Place Pickup Order
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-medium">Pickup Location</h3>
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap center={companyLocation} zoom={15} mapContainerStyle={{ width: "100%", height: "300px" }}>
            <Marker position={companyLocation} />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default PickupForm;
