import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../styles/appointment_dashboard.css';

const AppointmentDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/appointments');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header with Action Buttons */}
      <div className="header">
        <h1>Appointment Dashboard</h1>
        <div className="action-buttons">
          <button className="btn make-appointment" onClick={() => navigate('/appointment-form')}>
            Make an Appointment
          </button>
          <button className="btn drafted-reports">Drafted Technicians Reports</button>
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
              <th>Patient Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.patientName}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentDashboard;


