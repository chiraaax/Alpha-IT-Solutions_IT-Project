import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/appointment_dashboard.css";
import jsPDF from "jspdf";
import logo from "../../assets/AlphaITSolutionsLogo.jpg"; // Import the company logo
import sign from "../../assets/sign.png"

const AppointmentDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState(-1); // Initial stage is empty
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
    setCurrentStage(appointment.progress || -1); // Reset progress to empty when opening modal
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
    const isConfirmed = window.confirm("Are you sure you want to delete this appointment?");
    if (!isConfirmed) return;

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
  const generateReport = () => {
    try {
      if (!selectedAppointment) {
        alert("No appointment selected!");
        return;
      }
  
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
  
      // Use selectedAppointment instead of dummyAppointment
      const appointment = selectedAppointment;
  
      // Gradient Header Background
      const headerHeight = 50;
      for (let i = 0; i < headerHeight; i++) {
        const gradientColor = `rgb(${40 + (i * 2)}, ${53 - (i * 1)}, ${147 - (i * 2)})`; // Blue to Red gradient
        doc.setFillColor(gradientColor);
        doc.rect(0, i, pageWidth, 1, "F");
      }
  
      // Add company logo with proper aspect ratio
      const imgWidth = 40; // Adjusted width
      const imgHeight = 20; // Maintain aspect ratio
      doc.addImage(logo, "JPEG", 10, 10, imgWidth, imgHeight);
  
      // Title
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255); // White text for contrast
      doc.text("Appointment Details Report", pageWidth / 2, 20, { align: "center" });
  
      // Business Details
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255); // White text for contrast
      doc.text("Alpha IT Solutions", pageWidth / 2, 30, { align: "center" });
      doc.text("123 Galle Road, Colombo, Sri Lanka", pageWidth / 2, 35, { align: "center" });
      doc.text("Phone: +94 112 345 678", pageWidth / 2, 40, { align: "center" });
  
      // Report Generated Date (Moved Up)
      const currentDate = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255); // White text for contrast
      doc.text(`Report Generated: ${currentDate}`, pageWidth - 50, 45); // Adjusted y position to 45
  
      // Appointment Information Section
      doc.setFontSize(14);
      doc.setTextColor(40, 53, 147); // Dark blue text
      doc.text("Appointment Information", 10, 60);
  
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Black text
      let y = 70;
  
      const fields = [
        { label: "Name", value: appointment.name },
        { label: "Email", value: appointment.email },
        { label: "Phone", value: appointment.phone },
        { label: "Device Type", value: appointment.deviceType },
        { label: "Issue Description", value: appointment.issueDescription },
        { label: "Contact Method", value: appointment.contactMethod },
        { label: "Date", value: appointment.date },
        { label: "Time Slot", value: appointment.timeSlot },
        { label: "Problem Type", value: appointment.problemType },
        { label: "Pickup/Dropoff", value: appointment.pickupOrDropoff },
        { label: "Chip-Level Repair", value: appointment.chipLevelRepair ? "Yes" : "No" },
        { label: "Attempted Fixes", value: appointment.attemptedFixes ? "Yes" : "No" },
        { label: "Backup Data", value: appointment.backupData ? "Yes" : "No" },
      ];
  
      fields.forEach((field) => {
        doc.text(`${field.label}: ${field.value}`, 10, y);
        y += 10;
      });
  
      // Progress Bar Section
      y += 5; // Reduced space between "Progress Status" and circles
      doc.setFontSize(14);
      doc.setTextColor(40, 53, 147); // Dark blue text
      doc.text("Progress Status", 10, y);
      y += 5; // Reduced space between text and circles
  
      // Circular Progress Bar with Connecting Lines
      const circleRadius = 5; // Reduced size of circles
      const circleSpacing = 30; // Adjusted spacing between circles
      const startX = 20;
      const progressY = y + 10; // Adjusted position of circles
  
      progressStages.forEach((stage, index) => {
        const x = startX + index * circleSpacing;
        const isActive = index <= currentStage;
  
        // Draw connecting lines between circles
        if (index > 0) {
          const prevX = startX + (index - 1) * circleSpacing;
          doc.setDrawColor(200, 200, 200); // Light gray color for the line
          doc.setLineWidth(0.5);
          doc.line(prevX + circleRadius, progressY, x - circleRadius, progressY);
        }
  
        // Draw circle
        doc.setFillColor(isActive ? 40 : 200, isActive ? 53 : 200, isActive ? 147 : 200);
        doc.circle(x, progressY, circleRadius, "F");
  
        // Add stage text below the circle
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.text(stage, x, progressY + circleRadius + 5, { align: "center" });
      });
  
      // Add Signature Image (Moved Up)
      const signatureWidth = 30; // Adjusted width for the signature
      const signatureHeight = 15; // Adjusted height for the signature
      const signatureX = pageWidth - signatureWidth - 20; // Right-hand corner
      const signatureY = progressY + 30; // Adjusted position to avoid footer overlap
      doc.addImage(sign, "PNG", signatureX, signatureY, signatureWidth, signatureHeight);
  
      // Add Name Under the Signature
      const nameText = "John Doe"; // Replace with the desired name
      const nameX = signatureX + (signatureWidth / 2) - (doc.getTextWidth(nameText) / 2); // Center the name under the signature
      const nameY = signatureY + signatureHeight + 5; // Position the name below the signature
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0); // Black text
      doc.text(nameText, nameX, nameY);
  
      // Add Note Below the Signature
      const noteText = "Please show this PDF when the device is handed over.";
      const noteX = 10; // Left-aligned
      const noteY = nameY + 10; // Position the note below the name
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0); // Black text
      doc.text(noteText, noteX, noteY);
  
      // Gradient Footer Background (Smaller Footer)
      const footerHeight = 20; // Reduced footer height
      for (let i = 0; i < footerHeight; i++) {
        const gradientColor = `rgb(${40 + (i * 2)}, ${53 - (i * 1)}, ${147 - (i * 2)})`; // Blue to Red gradient
        doc.setFillColor(gradientColor);
        doc.rect(0, pageHeight - footerHeight + i, pageWidth, 1, "F");
      }
  
      // Footer with Additional Information (No Social Media Links)
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255); // White text for contrast
  
      // Company Information
      doc.text("Alpha IT Solutions", 10, pageHeight - 15);
      doc.text("123 Galle Road, Colombo, Sri Lanka", 10, pageHeight - 10);
      doc.text("Phone: +94 112 345 678 | Email: info@alphaitsolutions.com", 10, pageHeight - 5);
  
      // Save the PDF
      doc.save(`Appointment_Report_${appointment.name}.pdf`);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please check the console for details.");
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
          <button className="btn self-diagnosis" onClick={() => navigate("/AppointmenentAI")}>
            Self Diagnosis
          </button>
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
              {/* Input Fields */}
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

              {/* Display Status and Rejection Reason */}
              <div className="status-info">
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      selectedAppointment.status === "accepted"
                        ? "status-accepted"
                        : selectedAppointment.status === "rejected"
                        ? "status-rejected"
                        : "status-pending"
                    }
                  >
                    {selectedAppointment.status}
                  </span>
                </p>
                {selectedAppointment.status === "rejected" && (
                  <p>
                    <strong>Reason for Rejection:</strong> {selectedAppointment.rejectionReason}
                  </p>
                )}
              </div>

              {/* Progress Bar */}
              <div className="progress-bar">
                <h3>Progress</h3>
                <div className="progress-stages">
                  {progressStages.map((stage, index) => (
                    <div
                      key={index}
                      className={`progress-stage ${index <= currentStage ? "active" : ""} ${index === progressStages.length - 1 ? "final-stage" : ""}`}
                    >
                      <div className="circle"></div>
                      <span>{stage}</span>
                    </div>
                  ))}
                </div>
              </div>

           {/* Generate Report Button */}
  <button
    className="generate-report-btn"
    onClick={generateReport}
    disabled={selectedAppointment.status === "pending" || selectedAppointment.status === "rejected"}
  >
    Generate Report
  </button>
</div>

{/* Modal Footer */}
<div className="modal-footer">
  <button
    className="btn update-btn"
    onClick={handleUpdate}
    disabled={selectedAppointment.status === "accepted" || selectedAppointment.status === "rejected"}
  >
    Save Changes
  </button>
  <button
    className="btn delete-btn"
    onClick={handleDelete}
    disabled={selectedAppointment.status === "accepted" || selectedAppointment.status === "rejected"}
  >
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