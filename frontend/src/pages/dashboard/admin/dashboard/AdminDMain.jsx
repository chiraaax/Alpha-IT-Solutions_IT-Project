import React from "react";


const Dashboard = () => {
  // You would fetch this data from your API
  const appointments = []; // Your appointments data

  return (
    <div style={{ padding: "2rem", display: "grid", gap: "2rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
     
        {/* You can add more chart cards here in the future */}
      </div>
      
      {/* Rest of your dashboard content */}
    </div>
  );
};

export default Dashboard;
import React from 'react';
import InquiryChart from "../../../../components/InquiryChart/InquiryChart";
import ReviewChart from '../../../../components/ReviewChart/ReviewChart';

function AdminDMain() {
  return (
    <div>
      <InquiryChart/>
      <ReviewChart/>
    </div>
  )
}

export default AdminDMain
