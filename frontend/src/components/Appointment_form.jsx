import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button, Input } from "./ui"; // Adjust import paths as needed
import'../styles/appointment.css'

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
  });
  const [isBooked, setIsBooked] = useState(false);

  const handleBooking = () => {
    if (formData.name && formData.email && selectedTime) {
      setIsBooked(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black to-gray-900 text-white">
      {/* Header */}
      <header className="bg-blue-800 text-white py-4 text-center shadow-lg">
        <h1 className="text-3xl font-bold">Computer Repair Appointment Booking</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Selection */}
          <div className="p-6 rounded-lg shadow-lg border border-gray-700 bg-gray-900 bg-opacity-90">
            <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
            <div className="rounded-lg overflow-hidden p-3 bg-gray-800">
              <Calendar
                onChange={setDate}
                value={date}
                minDate={new Date()}
                className="custom-calendar"
              />
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="p-6 rounded-lg shadow-lg border border-gray-700 bg-gray-900 bg-opacity-90">
            <h2 className="text-xl font-semibold mb-4">Select a Time Slot</h2>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  variant={selectedTime === slot ? "default" : "outline"}
                  onClick={() => setSelectedTime(slot)}
                  className={`rounded-lg p-3 transition-all ${
                    selectedTime === slot ? "bg-blue-600 text-white" : "bg-white text-black"
                  }`}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="mt-6 p-6 rounded-lg shadow-lg border border-gray-700 bg-gray-900 bg-opacity-90">
          <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>
          <Input placeholder="Full Name" className="w-full p-3 mb-2 rounded-lg bg-gray-800 text-white border border-gray-600" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input placeholder="Email" className="w-full p-3 mb-2 rounded-lg bg-gray-800 text-white border border-gray-600" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <Input placeholder="Phone Number" className="w-full p-3 mb-2 rounded-lg bg-gray-800 text-white border border-gray-600" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <Input placeholder="Device Type" className="w-full p-3 mb-2 rounded-lg bg-gray-800 text-white border border-gray-600" onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })} />
          <Input placeholder="Issue Description" className="w-full p-3 mb-2 rounded-lg bg-gray-800 text-white border border-gray-600" onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })} />

          <div className="mb-4">
            <label className="block text-sm font-medium">Preferred Contact Method</label>
            <select className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600" value={formData.contactMethod} onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
          </div>

          <Button className="w-full p-3 rounded-lg bg-blue-600 text-white font-semibold transition-all hover:bg-blue-700" onClick={handleBooking}>
            Book Appointment
          </Button>
        </div>

        {/* Confirmation Message */}
        {isBooked && (
          <div className="mt-6 p-6 rounded-lg bg-green-500 text-white text-center">
            <h2 className="text-xl font-semibold">Appointment Confirmed!</h2>
            <p>Your appointment for <strong>{formData.deviceType}</strong> repair is booked for <strong>{date.toDateString()}</strong> at <strong>{selectedTime}</strong>.</p>
            <p>We will contact you via <strong>{formData.contactMethod === "email" ? "email" : "phone"}</strong>.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} Computer Repair Services. All rights reserved.</p>
      </footer>
    </div>
  );
}
