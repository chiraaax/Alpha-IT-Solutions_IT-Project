import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/appointment_dashboard.css'; // Reuse the existing styles

const DraftedTechniciansReports = () => {
  const navigate = useNavigate();
  const [expandedReportId, setExpandedReportId] = useState(null); // Track which report is expanded

  // Sample data for drafted technicians reports
  const reports = [
    {
      id: 1,
      issue: 'Computer running very slow',
      resolution:
        '1. Restart your computer to clear temporary files and refresh the system. \n' +
        '2. Uninstall unused programs to free up storage space. \n' +
        '3. Run a disk cleanup tool to remove temporary files and system cache. \n' +
        '4. Disable unnecessary startup programs from the Task Manager (Windows) or System Preferences (Mac). \n' +
        '5. Consider upgrading your RAM or switching to an SSD for better performance.',
    },
    {
      id: 2,
      issue: 'Wi-Fi connection keeps dropping',
      resolution:
        '1. Restart your router and modem by unplugging them for 30 seconds and plugging them back in. \n' +
        '2. Move your computer closer to the router to ensure a strong signal. \n' +
        '3. Check for interference from other devices (e.g., microwaves, cordless phones) and move them away. \n' +
        '4. Update your Wi-Fi drivers by visiting the manufacturer’s website. \n' +
        '5. Reset your network settings by going to Network Settings (Windows) or System Preferences (Mac).',
    },
    {
      id: 3,
      issue: 'Computer overheating and shutting down',
      resolution:
        '1. Ensure your computer is placed on a hard, flat surface to allow proper ventilation. \n' +
        '2. Clean the vents and fans using compressed air to remove dust buildup. \n' +
        '3. Avoid using your computer on soft surfaces like beds or couches, as they block airflow. \n' +
        '4. Use a cooling pad for laptops to improve airflow. \n' +
        '5. Check for background processes consuming too much CPU using Task Manager (Windows) or Activity Monitor (Mac).',
    },
    {
      id: 4,
      issue: 'Printer not printing',
      resolution:
        '1. Check if the printer is turned on and properly connected to your computer. \n' +
        '2. Ensure there is enough paper and ink/toner in the printer. \n' +
        '3. Restart both the printer and your computer. \n' +
        '4. Reinstall the printer drivers from the manufacturer’s website. \n' +
        '5. Clear any stuck print jobs from the printer queue in your computer’s settings.',
    },
    {
      id: 5,
      issue: 'Screen flickering or displaying strange colors',
      resolution:
        '1. Check the connection between your monitor and computer to ensure it’s secure. \n' +
        '2. Update your graphics card drivers from the manufacturer’s website. \n' +
        '3. Adjust the screen resolution and refresh rate in your display settings. \n' +
        '4. Test the monitor on another computer to rule out hardware issues. \n' +
        '5. If using a laptop, try connecting an external monitor to see if the issue persists.',
    },
  ];

  // Toggle the dropdown for a specific report
  const toggleReport = (id) => {
    if (expandedReportId === id) {
      setExpandedReportId(null); // Collapse if already expanded
    } else {
      setExpandedReportId(id); // Expand the clicked report
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header with Back Button */}
      <div className="header">
        <h1>Drafted Technicians Reports</h1>
        <div className="action-buttons">
          <button className="btn make-appointment" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="reports-list">
        <h2>Computer Repair Reports</h2>
        {reports.length > 0 ? (
          reports.map((report) => (
            <div key={report.id} className="report-item">
              <div
                className="report-summary"
                onClick={() => toggleReport(report.id)}
              >
                <h3>{report.issue}</h3>
                <span className="arrow">
                  {expandedReportId === report.id ? '▲' : '▼'}
                </span>
              </div>
              {expandedReportId === report.id && (
                <div className="report-details">
                  <p>
                    <strong>Resolution:</strong>
                    <pre>{report.resolution}</pre>
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No drafted reports found.</p>
        )}
      </div>
    </div>
  );
};

export default DraftedTechniciansReports;