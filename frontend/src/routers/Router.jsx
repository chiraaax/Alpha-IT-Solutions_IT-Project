import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import AppointmentDashboard from '../components/Appointment_Dashboard'; 

import AppointmentForm from '../components/Appointment_form';
import ProductCategory from '../shop/ProductCategory';
import SearchPage from '../shop/SearchPage';

import AppointmentForm from '../components/Appointment_form'; // Import Appointment Form
import DraftedTechniciansReports from '../components/DraftedTechniciansReports';


// Define the router object
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,  // App is the layout (Navbar + Outlet + Footer)
    children: [
      { path: '', element: <Home /> },
      { path: 'products/:category', element: <ProductCategory /> }, // Dynamic route for all categories
      { path: 'search', element: <SearchPage /> }, 
      { path: 'appointment', element: <AppointmentDashboard /> }, // Appointment Dashboard
      { path: 'appointment-form', element: <AppointmentForm /> }, // Appointment Form Route

      { path: 'draftedTechnicianReport', element: <DraftedTechniciansReports/> }, // Appointment Form Route
      // { path: 'laptops', element: <Laptops /> },
      // { path: 'processors', element: <Processors /> },
      // Add other routes here...

    ]
  }
]);

export default router;
