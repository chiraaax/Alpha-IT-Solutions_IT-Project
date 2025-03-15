import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import AppointmentDashboard from '../components/Appointment/Appointment_Dashboard';
import AppointmentForm from '../components/Appointment/Appointment_Form';
import DraftedTechniciansReports from '../components/DraftedTechniciansReports';
import Login from '../components/Register/Login';
import Register from '../components/Register/Register';
import ForgotPassword from '../components/Register/ForgotPassword';
import VerifyOTP from '../components/Register/VerifyOTP';
import FAQManage from '../components/Register/FAQManage';
import FAQ from '../components/Register/FAQ';
import ProductCategory from '../components/shop/ProductCategory';
import ProtectedRoute from "../routers/ProtectedRoute";  
import DashboardLayout from "../pages/dashboard/DashboardLayout";


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
      { path: 'draftedTechnicianReport', element: <DraftedTechniciansReports/> }, // Drafted Technician Report
      
      // Login & Registration routes
      
      { path: '/faq-manage', element: <ProtectedRoute element={<FAQManage />} allowedRoles={["admin"]} /> },
      { path: '/faq', element: <FAQ /> },
    ],
  },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/verify-otp', element: <VerifyOTP /> },
  
  //dashboard routes
  {
    path: "/dashboard",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>, // Use PrivateRoute for authentication
    children: [
      // User Dashboard Routes
      { path: '', element: <div>d</div> },
      { path: 'profile', element: <div>de</div> },
      { path: 'reviews', element:<div>sfs</div> },

      //admin routes (only accessible to admin) //TODO: use private route
      {
        path : 'admin', 
        element : <ProtectedRoute role="admin"><div>dg</div></ProtectedRoute> 
      },
      {
        path : 'add-new-product', 
        element : <ProtectedRoute role="admin"><div>dg</div></ProtectedRoute> 
      },
      {
        path : 'manage-products',
        element : <ProtectedRoute role="admin"> <div>dg</div></ProtectedRoute>
      },
      {
        path : 'update-product/:id',
        element : <ProtectedRoute role="admin"> <div>dg</div></ProtectedRoute>
      },        
      {
        path : 'users', 
        element : <ProtectedRoute role="admin"><div>dg</div></ProtectedRoute>
      },
    ],
  },
]);

export default router;
