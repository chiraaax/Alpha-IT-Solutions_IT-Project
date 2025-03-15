import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import AppointmentDashboard from '../components/Appointment/Appointment_Dashboard'; 
import AppointmentForm from '../components/Appointment/Appointment_form';
import ProductCategory from '../shop/ProductCategory';
import AppointmenentAI from "../components/Appointment/AppointmentAi"
import DraftedTechniciansReports from '../components/DraftedTechniciansReports';


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
      // { path: 'laptops', element: <Laptops /> },
      // { path: 'processors', element: <Processors /> },
      // Add other routes here...

    ]
  }
]);

export default router;
