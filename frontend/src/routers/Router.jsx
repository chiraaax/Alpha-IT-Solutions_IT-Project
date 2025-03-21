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
import CodForm from '../components/OrderManagement/CodForm';
// import OrderList from '../components/OrderManagement/OrderList';
import UpdateOrder from '../components/OrderManagement/updateOrder';
// import updateForm from '../components/OrderManagement/updateForm';

import CustomPreBuilds from '../components/CustomBuilds/CustomPreBuilds';
import AppointmentDashboard from '../components/Appointment/Appointment_Dashboard'; 
import AppointmentForm from '../components/Appointment/Appointment_form';
import AppointmenentAI from "../components/Appointment/AppointmentAi";
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
    element: <App />, // App is the layout (Navbar + Outlet + Footer)
    children: [
      { path: '', element: <Home /> },
      { path: 'products/:category', element: <ProductCategory /> },
      { path: 'appointment', element: <AppointmentDashboard /> },
      { path: 'AppointmenentAI', element: <AppointmenentAI /> },
      { path: 'appointment-form', element: <AppointmentForm /> },
      { path: 'draftedTechnicianReport', element: <DraftedTechniciansReports /> },
      { path: 'faq-manage', element: <ProtectedRoute element={<FAQManage />} allowedRoles={["admin"]} /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'custom-prebuilds', element: <CustomPreBuilds /> },

      //order management
      { path : 'ShoppingCart', element : <ShoppingCart />},  //shopping cart route
      { path : 'CheckoutForm', element : <CheckoutForm />},
      { path : 'PickupForm', element : <PickupForm />},
      { path : 'codForm', element : <CodForm />},
      // { path : 'OrderList', element : <OrderList />},
      { path : 'updateOrder', element : <UpdateOrder />},
      { path : 'updateOrder/:id', element : <UpdateOrder />},
      // { path : 'updateForm/:orderId', element : <updateForm />},
      // { path : "/CheckoutForm/edit/:orderId", element : <CheckoutForm />},
      
    ],
  }, 

  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/verify-otp', element: <VerifyOTP /> },
  // Dashboard routes
  {
    path: "/dashboard",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: '', element: <div>d</div> },
      { path: 'profile', element: <div>de</div> },
      { path: 'reviews', element: <div>sfs</div> },
      { path: 'admin', element: <ProtectedRoute role="admin"><div>dg</div></ProtectedRoute> },
      { path: 'add-new-product', element: <ProtectedRoute role="admin"><div>dg</div></ProtectedRoute> },
      { path: 'manage-products', element: <ProtectedRoute role="admin"><div>dg</div></ProtectedRoute> },
      { path: 'update-product/:id', element: <ProtectedRoute role="admin"><div>dg</div></ProtectedRoute> },
      { path: 'users', element: <ProtectedRoute role="admin"><div>dg</div></ProtectedRoute> },
    ],
  },
   
]);

export default router;
