import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
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
import ManageAppointments from "../pages/dashboard/manage-appointments"
// CustomBuilds Components
import GamingBuilds from '../components/CustomBuilds/GamingBuilds';
import BudgetBuilds from '../components/CustomBuilds/BudgetBuilds';
import BuildDetail from '../components/CustomBuilds/BuildDetail';
import CustomBuildForm from '../components/CustomBuilds/CustomBuildForm';
import AddProduct from '../pages/dashboard/admin/addProduct/AddProduct';
import ManageProducts from '../pages/dashboard/admin/manageProducts/ManageProducts';
import ManageInventory from '../pages/dashboard/admin/inventoryManagement/ManageInventory';
import ProductDetails from '../components/shop/ProductDetails';
import SearchPage from '../components/shop/search/SearchPage';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App is the layout (Navbar + Outlet + Footer)
    children: [
      { path: '', element: <Home /> },
      { path: 'products/:category', element: <ProductCategory /> },
      { path: 'appointment', element:<ProtectedRoute><AppointmentDashboard /></ProtectedRoute>},
      { path: 'AppointmenentAI', element:<ProtectedRoute><AppointmenentAI /></ProtectedRoute> },
      { path: 'appointment-form', element:<ProtectedRoute><AppointmentForm /></ProtectedRoute> },
      { path: 'draftedTechnicianReport', element:<ProtectedRoute><DraftedTechniciansReports /></ProtectedRoute> },
      { path: 'faq-manage', element: <ProtectedRoute element={<FAQManage />} allowedRoles={["admin"]} /> },
      { path: 'faq', element: <FAQ /> },

      // CustomBuilds routes
      { path: 'custom-prebuilds', element: <CustomPreBuilds /> },
      { path: 'gaming-builds', element: <GamingBuilds /> }, // New route for Gaming Builds
      { path: 'budget-builds', element: <BudgetBuilds /> }, // New route for Budget Builds
      // Modify these two routes to include the 'type' and 'id' dynamic params
      { path: 'gaming-builds/:type/:id', element: <BuildDetail /> }, // Route for Gaming Build Detail
      { path: 'budget-builds/:type/:id', element: <BuildDetail /> }, // Route for Budget Build Detail

      { path: 'custom-build-form', element: <CustomBuildForm /> }, // Route for Custom Build Form
    ]
  },
  
  // Authentication routes
      { path: '/shop/:productId', element: <ProductDetails /> },
      { path: 'search', element: <SearchPage /> },
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

      //customer routes
      { path: '', element: <div>d</div> },
      { path: 'profile', element: <div>de</div> },
      { path: 'reviews', element: <div>sfs</div> },

      //admin routes
      { path: 'admin', element: <ProtectedRoute role="admin"><div>dg</div></ProtectedRoute> },
      { path: 'add-new-product', element: <ProtectedRoute role="admin"><AddProduct/></ProtectedRoute> },
      { path: 'manage-products', element: <ProtectedRoute role="admin"><ManageProducts/></ProtectedRoute> },
      { path: 'manage-inventory', element: <ProtectedRoute role="admin"><ManageInventory/></ProtectedRoute> },
      { path: 'users', element: <ProtectedRoute role="admin"><div>dg</div></ProtectedRoute> },
      { path: 'manage-appointments', element: <ProtectedRoute role="admin"><ManageAppointments /></ProtectedRoute> },
    ]
  }
]);

export default router;
