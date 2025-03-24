import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/appointment_dashboard.css";

const Admin_AppointmentDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState(-1);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const progressStages = [
    "Device Handover",
    "Diagnosis",
    "Repair",
    "Testing",
    "Device Ready to Pick",
  ];

  // Fetch all appointments (Admin only)
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found. Redirecting to login...");
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/appointments/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch appointments: ${response.status}`);
        }

        const data = await response.json();
        setAppointments(data);
        setFilteredAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [navigate]);

  // Handle search input change
  useEffect(() => {
    const filtered = appointments.filter(
      (appointment) =>
        appointment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.issueDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAppointments(filtered);
  }, [searchQuery, appointments]);

  // Handle row click to open modal
  const handleRowClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
    setCurrentStage(appointment.progress || -1);
    setRejectionReason(appointment.rejectionReason || "");
    setIsButtonDisabled(appointment.status === "accepted" || appointment.status === "rejected");
  };

  // Update appointment status (accept/reject)
  const updateAppointmentStatus = async (status, reason = "") => {
    try {
      setIsButtonDisabled(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/appointments/${selectedAppointment._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status, rejectionReason: reason }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update appointment status");
      }

      const updatedAppointment = await response.json();
      setAppointments((prev) =>
        prev.map((app) => (app._id === updatedAppointment._id ? updatedAppointment : app))
      );
      setFilteredAppointments((prev) =>
        prev.map((app) => (app._id === updatedAppointment._id ? updatedAppointment : app))
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      setIsButtonDisabled(false);
    }
  };

  // Update appointment progress
  const updateProgress = async (stageIndex) => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:5000/api/appointments/${selectedAppointment._id}/progress`;
      const payload = JSON.stringify({ progress: stageIndex });

      console.log("Request URL:", url);
      console.log("Request Payload:", payload);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      if (!response.ok) {
        throw new Error("Failed to update progress");
      }

      const updatedAppointment = await response.json();
      console.log("Updated Appointment:", updatedAppointment);

      // Update local state
      setSelectedAppointment(updatedAppointment);
      setCurrentStage(stageIndex);

      // Update appointments list
      setAppointments((prev) =>
        prev.map((app) => (app._id === updatedAppointment._id ? updatedAppointment : app))
      );
      setFilteredAppointments((prev) =>
        prev.map((app) => (app._id === updatedAppointment._id ? updatedAppointment : app))
      );
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>Appointment Dashboard</h1>
        <input
          type="text"
          placeholder="Search by name, email, or issue..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "8px",
            width: "300px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            marginBottom: "20px",
          }}
          className="search-bar"
        />
      </div>
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
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment, index) => (
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
      {isModalOpen && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Appointment Details</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p><strong>Name:</strong> {selectedAppointment.name}</p>
              <p><strong>Email:</strong> {selectedAppointment.email}</p>
              <p><strong>Phone:</strong> {selectedAppointment.phone}</p>
              <p><strong>Device Type:</strong> {selectedAppointment.deviceType}</p>
              <p><strong>Issue Description:</strong> {selectedAppointment.issueDescription}</p>
              <p><strong>Contact Method:</strong> {selectedAppointment.contactMethod}</p>
              <p><strong>Date:</strong> {selectedAppointment.date}</p>
              <p><strong>Time Slot:</strong> {selectedAppointment.timeSlot}</p>
              <p><strong>Problem Type:</strong> {selectedAppointment.problemType}</p>
              <p><strong>Pickup/Dropoff:</strong> {selectedAppointment.pickupOrDropoff}</p>
              <p><strong>Chip Level Repair:</strong> {selectedAppointment.chipLevelRepair ? "Yes" : "No"}</p>
              <p><strong>Attempted Fixes:</strong> {selectedAppointment.attemptedFixes}</p>
              <p><strong>Backup Data:</strong> {selectedAppointment.backupData ? "Yes" : "No"}</p>
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
              {selectedAppointment.status === "pending" && (
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a reason for rejection"
                />
              )}
              <div className="modal-actions" style={{ display: "flex", gap: "10px", margin: "4px" }}>
                <button
                  className="btn accept-btn"
                  onClick={() => updateAppointmentStatus("accepted")}
                  disabled={isButtonDisabled}
                  style={{
                    backgroundColor: isButtonDisabled ? "#ccc" : "#4CAF50",
                    color: isButtonDisabled ? "#666" : "#fff",
                    cursor: isButtonDisabled ? "not-allowed" : "pointer",
                  }}
                >
                  Accept
                </button>
                <button
                  className="btn reject-btn"
                  onClick={() => updateAppointmentStatus("rejected", rejectionReason)}
                  disabled={isButtonDisabled}
                  style={{
                    backgroundColor: isButtonDisabled ? "#ccc" : "#f44336",
                    color: isButtonDisabled ? "#666" : "#fff",
                    cursor: isButtonDisabled ? "not-allowed" : "pointer",
                  }}
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