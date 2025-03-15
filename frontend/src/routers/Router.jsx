import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import CustomPreBuilds from '../components/CustomBuilds/CustomPreBuilds';
import AppointmentDashboard from '../components/Appointment/Appointment_Dashboard'; 
import AppointmentForm from '../components/Appointment/Appointment_form';
import AppointmenentAI from "../components/Appointment/AppointmentAi"
import DraftedTechniciansReports from '../components/DraftedTechniciansReports';
import Login from '../components/Register/Login';
import Register from '../components/Register/Register';
import ForgotPassword from '../components/Register/ForgotPassword';
import VerifyOTP from '../components/Register/VerifyOTP';
import FAQManage from '../components/Register/FAQManage';
import FAQ from '../components/Register/FAQ';
import ProductCategory from '../components/shop/ProductCategory';
import ProtectedRoute from "../routers/ProtectedRoute"; 

//CustomBuilds Components
import GamingBuilds from '../components/CustomBuilds/GamingBuilds'; // Import GamingBuilds
import BudgetBuilds from '../components/CustomBuilds/BudgetBuilds'; // Import BudgetBuilds
import BuildDetail from '../components/CustomBuilds/BuildDetail'; // Import BuildDetail
import CustomBuildForm from '../components/CustomBuilds/CustomBuildForm'; // Import CustomBuildForm



// Define the router object
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,  // App is the layout (Navbar + Outlet + Footer)
    children: [
      { path: '', element: <Home /> },
      { path: 'products/:category', element: <ProductCategory /> },
      { path: 'appointment', element: <AppointmentDashboard /> },
      { path: 'AppointmenentAI', element: <AppointmenentAI /> },
      { path: 'appointment-form', element: <AppointmentForm /> },
      { path: 'draftedTechnicianReport', element: <DraftedTechniciansReports /> },

      // Register, Login, ForgotPassword, VerifyOTP routes
      { path: '/login', element: <Login /> },
      { path: '/Register', element: <Register /> },
      { path: '/ForgotPassword', element: <ForgotPassword /> },
      { path: '/VerifyOTP', element: <VerifyOTP /> },
      { path: "FAQManage", element: <ProtectedRoute element={<FAQManage />} allowedRoles={["admin"]} /> },
      { path: '/FAQ', element: <FAQ /> },

      // CustomBuilds routes
      { path: 'custom-prebuilds', element: <CustomPreBuilds /> },
      { path: 'gaming-builds', element: <GamingBuilds /> }, // New route for Gaming Builds
      { path: 'budget-builds', element: <BudgetBuilds /> }, // New route for Budget Builds     
      { path: 'gaming-builds/:id', element: <BuildDetail type="gaming" /> }, // Route for Gaming Build Detail
      { path: 'budget-builds/:id', element: <BuildDetail type="budget" /> }, // Route for Budget Build Detail
      { path: 'custom-build-form', element: <CustomBuildForm /> }, // Route for Custom Build Form
    ]
  }
]);

export default router;
