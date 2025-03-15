import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
<<<<<<< HEAD
import AppointmentDashboard from '../components/Appointment_Dashboard'; 

import AppointmentForm from '../components/Appointment_form';
import ProductCategory from '../shop/ProductCategory';
import DraftedTechniciansReports from '../components/DraftedTechniciansReports';
import CustomPreBuilds from '../components/CustomBuilds/CustomPreBuilds';

=======
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
>>>>>>> 54af226e6697d29e87af9302ab913e9a93e95367


// Define the router object
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,  // App is the layout (Navbar + Outlet + Footer)
    children: [
      { path: '', element: <Home /> },
      { path: 'products/:category', element: <ProductCategory /> }, // Dynamic route for all categories
<<<<<<< HEAD

=======
>>>>>>> 54af226e6697d29e87af9302ab913e9a93e95367
      { path: 'appointment', element: <AppointmentDashboard /> }, // Appointment Dashboard
      {path: 'AppointmenentAI', element:<AppointmenentAI/>},
      { path: 'appointment-form', element: <AppointmentForm /> }, // Appointment Form Route
      { path: 'draftedTechnicianReport', element: <DraftedTechniciansReports/> }, // Appointment Form Route
      
      //login routes
      { path: '/login', element: <Login /> },
      { path: '/Register', element: <Register /> },
      { path: '/ForgotPassword', element: <ForgotPassword /> },
      { path: '/VerifyOTP', element: <VerifyOTP /> },
      { path: "FAQManage", element: <ProtectedRoute element={<FAQManage />} allowedRoles={["admin"]} /> },
      { path: '/FAQ', element: <FAQ /> },

      { path: 'custom-prebuilds', element: <CustomPreBuilds /> },

    ]
  }
]);

export default router;
