import React from "react";
import InquiryChart from "../../../../components/InquiryChart/InquiryChart";
import ReviewChart from "../../../../components/ReviewChart/ReviewChart";

const Dashboard = () => {
  // You would fetch this data from your API
  const appointments = []; // Your appointments data

  return (
    <div style={{ padding: "2rem", display: "grid", gap: "2rem" }}>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr", // Changed to single column
        gap: "2rem" 
      }}>
        <InquiryChart/>
        <ReviewChart/>
     
        {/* You can add more chart cards here in the future */}
      </div>
      
      {/* Rest of your dashboard content */}
    </div>
  );
};

export default Dashboard;
