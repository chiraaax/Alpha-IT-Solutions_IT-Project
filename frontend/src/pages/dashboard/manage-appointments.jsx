import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/appointment_dashboard.css";

const Admin_AppointmentDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState(-1); // Initial stage is empty
  const [rejectionReason, setRejectionReason] = useState(""); // Reason for rejection
  const navigate = useNavigate();

  // Progress stages
  const progressStages = [
    "Device Handover",
    "Diagnosis",
    "Repair",
    "Testing",
    "Device Ready to Pick",
  ];

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
    setCurrentStage(appointment.progress || -1); // Set current progress stage
    setRejectionReason(appointment.rejectionReason || ""); // Set rejection reason
  };

  // Handle accept appointment
  const handleAccept = async () => {
    try {
      const updatedAppointment = { ...selectedAppointment, status: "accepted", rejectionReason: "" };
      const response = await fetch(`http://localhost:5000/api/appointments/${selectedAppointment._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "accepted" }),
      });

      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }

      const updatedAppointmentData = await response.json();
      setAppointments((prev) =>
        prev.map((app) => (app._id === updatedAppointmentData._id ? updatedAppointmentData : app))
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error accepting appointment:", error);
    }
  };

  // Handle reject appointment
  const handleReject = async () => {
    if (!rejectionReason) {
      alert("Please provide a reason for rejection.");
      return;
    }

    try {
      const updatedAppointment = { ...selectedAppointment, status: "rejected", rejectionReason };
      const response = await fetch(`http://localhost:5000/api/appointments/${selectedAppointment._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "rejected", rejectionReason }),
      });

      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }

      const updatedAppointmentData = await response.json();
      setAppointments((prev) =>
        prev.map((app) => (app._id === updatedAppointmentData._id ? updatedAppointmentData : app))
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error rejecting appointment:", error);
    }
  };

  // Handle updating progress stage
  const updateProgress = async (stageIndex) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${selectedAppointment._id}/progress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ progress: stageIndex }),
      });

      if (!response.ok) {
        throw new Error("Failed to update progress");
      }

      const updatedAppointment = await response.json();
      setSelectedAppointment(updatedAppointment);
      setCurrentStage(stageIndex);
      setAppointments((prev) =>
        prev.map((app) => (app._id === updatedAppointment._id ? updatedAppointment : app))
      );
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header with Action Buttons */}
      <div className="header">
        <h1>Appointment Dashboard</h1>
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
              <th>Status</th>
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
                  <td>{appointment.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Detailed View */}
      {isModalOpen && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Appointment Details</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {/* Display Appointment Details */}
              <div className="appointment-info">
                <p>
                  <strong>Name:</strong> {selectedAppointment.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedAppointment.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedAppointment.phone}
                </p>
                <p>
                  <strong>Device Type:</strong> {selectedAppointment.deviceType}
                </p>
                <p>
                  <strong>Issue Description:</strong> {selectedAppointment.issueDescription}
                </p>
                <p>
                  <strong>Contact Method:</strong> {selectedAppointment.contactMethod}
                </p>
                <p>
                  <strong>Date:</strong> {selectedAppointment.date}
                </p>
                <p>
                  <strong>Time Slot:</strong> {selectedAppointment.timeSlot}
                </p>
                <p>
                  <strong>Problem Type:</strong> {selectedAppointment.problemType}
                </p>
                <p>
                  <strong>Pickup/Dropoff:</strong> {selectedAppointment.pickupOrDropoff}
                </p>
                <p>
                  <strong>Chip-Level Repair:</strong> {selectedAppointment.chipLevelRepair ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Attempted Fixes:</strong> {selectedAppointment.attemptedFixes ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Backup Data:</strong> {selectedAppointment.backupData ? "Yes" : "No"}
                </p>
              </div>

         {/* Progress Bar (Conditional Rendering) */}
{selectedAppointment.status === "accepted" && (
  <div className="progress-bar">
    <h3>Progress</h3>
    <div className="progress-stages">
      {progressStages.map((stage, index) => (
        <div
          key={index}
          className={`progress-stage ${index <= currentStage ? "active" : ""}`}
          onClick={() => updateProgress(index)}
        >
          <div className="circle"></div>
          <span>{stage}</span>
        </div>
      ))}
    </div>
  </div>
)}

              {/* Reason for Rejection */}
              {selectedAppointment.status === "pending" && (
                <div className="rejection-reason">
                  <label>Reason for Rejection:</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a reason for rejection"
                  />
                </div>
              )}

              {/* Accept/Reject Buttons */}
<div className="accept-reject-buttons">
  <button
    className="btn accept-btn"
    onClick={handleAccept}
    disabled={selectedAppointment.status === "accepted" || selectedAppointment.status === "rejected"}
  >
    Accept
  </button>
  <button
    className="btn reject-btn"
    onClick={handleReject}
    disabled={selectedAppointment.status === "accepted" || selectedAppointment.status === "rejected"}
  >
    Reject
  </button>
</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin_AppointmentDashboard;