import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { Button, Input } from "./ui";
import "../../styles/appointment.css"
const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

export default function AppointmentDashboard() {
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    deviceType: "",
    issueDescription: "",
    contactMethod: "email",
    problemType: "", // New field for problem type
    pickupOrDropoff: "", // New field for pickup or dropoff
    chipLevelRepair: false, // New field for chip-level repair
    attemptedFixes: false, // New field for attempted fixes
    backupData: false, // New field for data backup
  });
  const [isBooked, setIsBooked] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [bookingError, setBookingError] = useState("");

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleBooking = async () => {
    setPhoneError("");
    setBookingError("");
    if (!validatePhoneNumber(formData.phone)) {
      setPhoneError("Phone number must be exactly 10 digits.");
      return;
    }
    if (formData.name && formData.email && selectedTime) {
      try {
        const response = await axios.post("http://localhost:5000/api/appointments", {
          ...formData,
          date: date.toISOString().split("T")[0],
          timeSlot: selectedTime,
        });

        if (response.status === 201) {
          setIsBooked(true);
          setBookingError("");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setBookingError(error.response.data.message);
        } else {
          console.error("Error booking appointment:", error);
          setBookingError("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black to-gray-900 text-white">
      <header className="bg-blue-800 text-white py-4 text-center shadow-lg">
        <h1 className="text-3xl font-bold">Computer Repair Appointment Booking</h1>
      </header>
      <main className="flex-grow p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg shadow-lg border border-gray-700 bg-gray-900 bg-opacity-90">
            <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
            <Calendar onChange={setDate} value={date} minDate={new Date()} className="custom-calendar" />
          </div>
          <div className="p-6 rounded-lg shadow-lg border border-gray-700 bg-gray-900 bg-opacity-90">
            <h2 className="text-xl font-semibold mb-4">Select a Time Slot</h2>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  variant={selectedTime === slot ? "default" : "outline"}
                  onClick={() => setSelectedTime(slot)}
                  className={`rounded-lg p-3 transition-all ${selectedTime === slot ? "bg-blue-600 text-white" : "bg-white text-black"}`}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 p-6 rounded-lg shadow-lg border border-gray-700 bg-gray-900 bg-opacity-90">
          <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>
          <Input
            value={formData.name}
            placeholder="Full Name"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            value={formData.email}
            placeholder="Email"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            value={formData.phone}
            placeholder="Phone Number"
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          {phoneError && <p className="text-red-500 text-sm mb-2">{phoneError}</p>}
          <Input
            value={formData.deviceType}
            placeholder="Device Type"
            onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
          />
          <Input
            value={formData.issueDescription}
            placeholder="Issue Description"
            onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium">Preferred Contact Method</label>
            <select
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
              value={formData.contactMethod}
              onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
          </div>

          {/* New Fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Problem Type</label>
            <select
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
              value={formData.problemType}
              onChange={(e) => setFormData({ ...formData, problemType: e.target.value })}
            >
              <option value="">Select Problem Type</option>
              <option value="hardware">Hardware Problem</option>
              <option value="software">Software Problem</option>
              <option value="virus">Virus Problem</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Pickup or Dropoff</label>
            <select
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
              value={formData.pickupOrDropoff}
              onChange={(e) => setFormData({ ...formData, pickupOrDropoff: e.target.value })}
            >
              <option value="">Select Option</option>
              <option value="pickup">Pickup</option>
              <option value="dropoff">Dropoff</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">
              <input
                type="checkbox"
                checked={formData.chipLevelRepair}
                onChange={(e) => setFormData({ ...formData, chipLevelRepair: e.target.checked })}
                className="mr-2"
              />
              Chip-Level Repair Required
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">
              <input
                type="checkbox"
                checked={formData.attemptedFixes}
                onChange={(e) => setFormData({ ...formData, attemptedFixes: e.target.checked })}
                className="mr-2"
              />
              Have You Attempted Any Fixes?
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">
              <input
                type="checkbox"
                checked={formData.backupData}
                onChange={(e) => setFormData({ ...formData, backupData: e.target.checked })}
                className="mr-2"
              />
              Do You Need Data Backup Before Repairs?
            </label>
          </div>

          <Button
            className="w-full p-3 rounded-lg bg-blue-600 text-white font-semibold transition-all hover:bg-blue-700"
            onClick={handleBooking}
          >
            Book Appointment
          </Button>
        </div>
        {bookingError && (
          <div className="mt-6 p-6 rounded-lg bg-red-500 text-white text-center">
            <p>{bookingError}</p>
          </div>
        )}
        {isBooked && (
          <div className="mt-6 p-6 rounded-lg bg-green-500 text-white text-center">
            <h2 className="text-xl font-semibold">Appointment Confirmed!</h2>
            <p>Your appointment for <strong>{formData.deviceType}</strong> repair is booked for <strong>{date.toDateString()}</strong> at <strong>{selectedTime}</strong>.</p>
            <p>We will contact you via <strong>{formData.contactMethod === "email" ? "email" : "phone"}</strong>.</p>
          </div>
        )
}
      </main>
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} Computer Repair Services. All rights reserved.</p>
      </footer>
    </div>
  );
}