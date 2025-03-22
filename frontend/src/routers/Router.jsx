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

import AddProduct from '../pages/dashboard/admin/addProduct/AddProduct';
import ManageProducts from '../pages/dashboard/admin/manageProducts/ManageProducts';
import ManageInventory from '../pages/dashboard/admin/inventoryManagement/ManageInventory';
import ProductDetails from '../components/shop/ProductDetails';
import SearchPage from '../components/shop/search/SearchPage';
import ManageAppointments from "../pages/dashboard/manage-appointments";

// CustomBuilds Components
import GamingBuilds from '../components/CustomBuilds/GamingBuilds';
import BudgetBuilds from '../components/CustomBuilds/BudgetBuilds';
import GamingBuildDetail from '../components/CustomBuilds/GamingBuildDetail';
import BudgetBuildDetail from '../components/CustomBuilds/BudgetBuildDetail'; // New Import
import CreateCustomBuild from '../components/CustomBuilds/CreateCustomPreBuild';
import CustomizeBuild from '../components/CustomBuilds/CustomizeBuild'; // ✅ New Import

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <Home /> },
      { path: 'products/:category', element: <ProductCategory /> },
      { path: 'appointment', element: <ProtectedRoute><AppointmentDashboard /></ProtectedRoute> },
      { path: 'AppointmenentAI', element: <ProtectedRoute><AppointmenentAI /></ProtectedRoute> },
      { path: 'appointment-form', element: <ProtectedRoute><AppointmentForm /></ProtectedRoute> },
      { path: 'draftedTechnicianReport', element: <ProtectedRoute><DraftedTechniciansReports /></ProtectedRoute> },
      { path: 'faq-manage', element: <ProtectedRoute allowedRoles={["admin"]}><FAQManage /></ProtectedRoute> },
      { path: 'appointment', element: <ProtectedRoute><AppointmentDashboard /></ProtectedRoute> },
      { path: 'AppointmenentAI', element: <ProtectedRoute><AppointmenentAI /></ProtectedRoute> },
      { path: 'appointment-form', element: <ProtectedRoute><AppointmentForm /></ProtectedRoute> },
      { path: 'draftedTechnicianReport', element: <ProtectedRoute><DraftedTechniciansReports /></ProtectedRoute> },
      { path: 'faq-manage', element: <ProtectedRoute element={<FAQManage />} allowedRoles={["admin"]} /> },
      { path: 'faq', element: <FAQ /> },
      // CustomBuilds routes
      { path: 'custom-prebuilds', element: <CustomPreBuilds /> },
      { path: 'shop/:productId', element: <ProductDetails /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'gaming-builds', element: <GamingBuilds /> },
      { path: 'budget-builds', element: <BudgetBuilds /> },        
      { path: 'gaming-builds', element: <GamingBuilds /> },
      { path: 'budget-builds', element: <BudgetBuilds /> },
      { path: 'gaming-builds/:id', element: <GamingBuildDetail /> },
      { path: 'budget-builds/:id', element: <BudgetBuildDetail /> },
      { path: 'create-custom-prebuild', element: <CreateCustomBuild /> },
      { path: 'customize-build/:id', element: <CustomizeBuild /> }, // ✅ New Route
    ]
  },

  // Authentication routes
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/verify-otp', element: <VerifyOTP /> },
  // Dashboard routes
  {
    path: "/dashboard",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      // Customer routes
      { path: '', element: <div>Dashboard Home</div> },
      { path: 'profile', element: <div>Profile</div> },
      { path: 'reviews', element: <div>Reviews</div> },
      // Admin routes
      { path: 'admin', element: <ProtectedRoute allowedRoles={["admin"]}><div>Admin Panel</div></ProtectedRoute> },
      { path: 'add-new-product', element: <ProtectedRoute allowedRoles={["admin"]}><AddProduct /></ProtectedRoute> },
      { path: 'manage-products', element: <ProtectedRoute allowedRoles={["admin"]}><ManageProducts /></ProtectedRoute> },
      { path: 'manage-inventory', element: <ProtectedRoute allowedRoles={["admin"]}><ManageInventory /></ProtectedRoute> },
      { path: 'users', element: <ProtectedRoute allowedRoles={["admin"]}><div>Manage Users</div></ProtectedRoute> },
      { path: 'manage-appointments', element: <ProtectedRoute allowedRoles={["admin"]}><ManageAppointments /></ProtectedRoute> },
    ]
  }
]);

export default router;
