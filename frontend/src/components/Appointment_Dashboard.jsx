import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/appointment_dashboard.css";

const AppointmentDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/appointments");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Handle row click to open modal
  const handleRowClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  // Handle input change in modal
  const handleInputChange = (e) => {
    setSelectedAppointment({ ...selectedAppointment, [e.target.name]: e.target.value });
  };

  // Handle update appointment
  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${selectedAppointment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedAppointment),
      });

      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }

      const updatedAppointments = appointments.map((appointment) =>
        appointment._id === selectedAppointment._id ? selectedAppointment : appointment
      );
      setAppointments(updatedAppointments);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  // Handle delete appointment
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${selectedAppointment._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }

      setAppointments(appointments.filter((appointment) => appointment._id !== selectedAppointment._id));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header with Action Buttons */}
      <div className="header">
        <h1>Appointment Dashboard</h1>
        <div className="action-buttons">
          <button className="btn make-appointment" onClick={() => navigate("/appointment-form")}>
            Make an Appointment
          </button>
          <button className="btn drafted-reports" onClick={() => navigate("/draftedTechnicianReport")}>
            Drafted Technicians Reports
          </button>
          <button className="btn self-diagnosis">Self Diagnosis</button>
        </div>
      </div>

      {/* Appointment Details Section */}
      <div className="appointment-details">
        <h2>Appointment Details</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Issue Description</th>
              <th>Date</th>
              <th>Time Slot</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <tr key={appointment._id} onClick={() => handleRowClick(appointment)}>
                  <td>{index + 1}</td>
                  <td>{appointment.name}</td>
                  <td>{appointment.issueDescription}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.timeSlot}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Detailed View and Editing */}
      {isModalOpen && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Appointment</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <label>Name:</label>
              <input type="text" name="name" value={selectedAppointment.name} onChange={handleInputChange} />

              <label>Email:</label>
              <input type="email" name="email" value={selectedAppointment.email} onChange={handleInputChange} />

              <label>Phone:</label>
              <input type="text" name="phone" value={selectedAppointment.phone} onChange={handleInputChange} />

              <label>Device Type:</label>
              <input type="text" name="deviceType" value={selectedAppointment.deviceType} onChange={handleInputChange} />

              <label>Issue Description:</label>
              <textarea name="issueDescription" value={selectedAppointment.issueDescription} onChange={handleInputChange}></textarea>

              <label>Contact Method:</label>
              <input type="text" name="contactMethod" value={selectedAppointment.contactMethod} onChange={handleInputChange} />

              <label>Date:</label>
              <input type="date" name="date" value={selectedAppointment.date} onChange={handleInputChange} />

              <label>Time Slot:</label>
              <input type="text" name="timeSlot" value={selectedAppointment.timeSlot} onChange={handleInputChange} />

              <label>Problem Type:</label>
              <input type="text" name="problemType" value={selectedAppointment.problemType} onChange={handleInputChange} />

              <label>Pickup/Dropoff:</label>
              <input type="text" name="pickupOrDropoff" value={selectedAppointment.pickupOrDropoff} onChange={handleInputChange} />

              <label>Chip-Level Repair:</label>
              <input type="checkbox" name="chipLevelRepair" checked={selectedAppointment.chipLevelRepair} onChange={(e) => setSelectedAppointment({ ...selectedAppointment, chipLevelRepair: e.target.checked })} />

              <label>Attempted Fixes:</label>
              <input type="checkbox" name="attemptedFixes" checked={selectedAppointment.attemptedFixes} onChange={(e) => setSelectedAppointment({ ...selectedAppointment, attemptedFixes: e.target.checked })} />

              <label>Backup Data:</label>
              <input type="checkbox" name="backupData" checked={selectedAppointment.backupData} onChange={(e) => setSelectedAppointment({ ...selectedAppointment, backupData: e.target.checked })} />
            </div>
            <div className="modal-footer">
              <button className="btn update-btn" onClick={handleUpdate}>
                Save Changes
              </button>
              <button className="btn delete-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDashboard;




