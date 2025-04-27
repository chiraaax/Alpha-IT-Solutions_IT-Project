import React from "react";
import AppointmentChartCard from "../charts/AppointmentChart";

const Dashboard = () => {
  // You would fetch this data from your API
  const appointments = []; // Your appointments data

  return (
    <div style={{ padding: "2rem", display: "grid", gap: "2rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        <AppointmentChartCard appointments={appointments} />
        {/* You can add more chart cards here in the future */}
      </div>
      
      {/* Rest of your dashboard content */}
    </div>
  );
};

export default Dashboard;