import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';import AppointmentDashboard from '../components/Appointment_Dashboard'; 
import ProductCategory from '../shop/ProductCategory';
import AppointmentForm from '../components/Appointment_form';
import DraftedTechniciansReports from '../components/DraftedTechniciansReports';
import Login from '../components/Register/Login';
import Register from '../components/Register/Register';
import ForgotPassword from '../components/Register/ForgotPassword';
import VerifyOTP from '../components/Register/VerifyOTP';
import UserNav from '../components/Register/UserNav';
import Profile from '../components/Register/Profile';
import FAQManage from '../components/Register/FAQManage';
import AdminNav from '../components/Register/AdminNav';
import FAQ from '../components/Register/FAQ';


// Define the router object
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,  // App is the layout (Navbar + Outlet + Footer)
    children: [
      { path: '', element: <Home /> },
      { path: 'products/:category', element: <ProductCategory /> }, // Dynamic route for all categories
      { path: 'appointment', element: <AppointmentDashboard /> }, // Appointment Dashboard
      { path: 'appointment-form', element: <AppointmentForm /> }, // Appointment Form Route
      { path: 'draftedTechnicianReport', element: <DraftedTechniciansReports/> }, // Appointment Form Route
      
      //login routes
      { path: '/login', element: <Login /> },
      { path: '/Register', element: <Register /> },
      { path: '/ForgotPassword', element: <ForgotPassword /> },
      { path: '/VerifyOTP', element: <VerifyOTP /> },
      { path: '/UserNav', element: <UserNav /> },
      { path: '/Profile', element: <Profile /> },
      { path: '/FAQManage', element: <FAQManage /> },
      { path: '/AdminNav', element: <AdminNav /> },
      { path: '/FAQ', element: <FAQ /> },

    ]
  }
]);

export default router;
