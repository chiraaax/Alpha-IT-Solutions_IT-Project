import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';

// import AppointmentDashboard from '../components/Appointment_Dashboard'; 

// import AppointmentForm from '../components/Appointment_form';
// import ProductCategory from '../shop/ProductCategory';
// import SearchPage from '../shop/SearchPage';

// import AppointmentForm from '../components/Appointment_form'; // Import Appointment Form
// import DraftedTechniciansReports from '../components/DraftedTechniciansReports';
//order management
import ShoppingCart from '../pages/OrderManagement/shoppingCart';
import CheckoutForm from '../components/OrderManagement/CheckoutForm';
import PickupForm from '../components/OrderManagement/pickupForm';

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


// Define the router object
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,  // App is the layout (Navbar + Outlet + Footer)
    children: [
      { path: '', element: <Home /> },
      { path: 'products/:category', element: <ProductCategory /> }, // Dynamic route for all categories


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

      //order management
      { path : '/ShoppingCart', element : <ShoppingCart />},  //shopping cart route
      { path : '/CheckoutForm', element : <CheckoutForm />},
      { path : '/PickupForm', element : <PickupForm />}
      
    ]
  }
]);

export default router;
