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
import Profile from '../components/Register/Profile';
import UserManage from '../components/Register/UserManage';

//Inquiry Components
import InquiryForm from '../components/Inquiry/InquiryForm';
import InquiryManage from '../components/Inquiry/InquiryManage';
import UserInquiries from '../components/Inquiry/UserInquiries';

//Review Components
import UserReviews from '../components/Reviews/UserReviews';
import ReviewManage from '../components/Reviews/ReviewManage';
import ReviewForm from '../components/Reviews/ReviewForm';

// CustomBuilds Components
import GamingBuilds from '../components/CustomBuilds/GamingBuilds';
import BudgetBuilds from '../components/CustomBuilds/BudgetBuilds';
import GamingBuildDetail from '../components/CustomBuilds/GamingBuildDetail';
import BudgetBuildDetail from '../components/CustomBuilds/BudgetBuildDetail';
import CreateCustomBuild from '../components/CustomBuilds/CreateCustomPreBuild';
import CustomizeBuild from '../components/CustomBuilds/CustomizeBuild'; // ✅ New Import
import FilterForm from '../pages/dashboard/admin/filterProducts/FilterForm';
import FiltersList from '../pages/dashboard/admin/filterProducts/FiltersList';

import BuildDetail from '../components/CustomBuilds/BuildDetail';
import CustomBuildForm from '../components/CustomBuilds/CustomBuildForm';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App is the layout (Navbar + Outlet + Footer)
    children: [
      { path: '', element: <Home /> },
      { path: 'products/:category', element: <ProductCategory /> },
      { path: 'appointment', element: <ProtectedRoute><AppointmentDashboard /></ProtectedRoute> },
      { path: 'AppointmenentAI', element: <ProtectedRoute><AppointmenentAI /></ProtectedRoute> },
      { path: 'draftedTechnicianReport', element: <ProtectedRoute><DraftedTechniciansReports /></ProtectedRoute> },
      { path: 'appointment-form', element: <ProtectedRoute><AppointmentForm /></ProtectedRoute> },
      { path: 'appointment', element:<ProtectedRoute><AppointmentDashboard /></ProtectedRoute>},
      { path: 'AppointmenentAI', element:<ProtectedRoute><AppointmenentAI /></ProtectedRoute> },
      { path: 'appointment-form', element:<ProtectedRoute><AppointmentForm /></ProtectedRoute> },
      { path: 'draftedTechnicianReport', element:<ProtectedRoute><DraftedTechniciansReports /></ProtectedRoute> },
      { path: 'faq-manage', element: <ProtectedRoute element={<FAQManage />} allowedRoles={["admin"]} /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'ReviewForm', element:<ReviewForm/>},
      { path: 'UserReviews', element:<UserReviews/>},
      { path: 'InquiryForm', element:<InquiryForm/>},
      { path: 'UserInquiries', element:<UserInquiries/>},

      // CustomBuilds routes
      { path: 'custom-prebuilds', element: <CustomPreBuilds /> },
      { path: 'shop/:productId', element: <ProductDetails /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'gaming-builds', element: <GamingBuilds /> },
      { path: 'budget-builds', element: <BudgetBuilds /> },        
      { path: 'gaming-builds/:id', element: <GamingBuildDetail /> },
      { path: 'budget-builds/:id', element: <BudgetBuildDetail /> },  
      { path: 'customize-build/:id', element: <CustomizeBuild /> }, 

      { path: 'gaming-builds', element: <GamingBuilds /> }, // New route for Gaming Builds
      { path: 'budget-builds', element: <BudgetBuilds /> }, // New route for Budget Builds
      // Modify these two routes to include the 'type' and 'id' dynamic params
      { path: 'gaming-builds/:type/:id', element: <BuildDetail /> }, // Route for Gaming Build Detail
      { path: 'budget-builds/:type/:id', element: <BuildDetail /> }, // Route for Budget Build Detail

      { path: 'custom-build-form', element: <CustomBuildForm /> }, // Route for Custom Build Form
    ]
  },
  
  // Authentication routes
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/verify-otp', element: <VerifyOTP /> },
  { path: '/profile', element: <Profile/>},

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
      { path: 'manage-filters', element: <ProtectedRoute allowedRoles={["admin"]}><FilterForm /></ProtectedRoute> },
      { path: 'manage-filters-db', element: <ProtectedRoute allowedRoles={["admin"]}><FiltersList /></ProtectedRoute> },
      { path: 'create-custom-prebuild', element: <ProtectedRoute allowedRoles={["admin"]}><CreateCustomBuild /></ProtectedRoute> },

      { path: '', element: <div>d</div> },
      { path: 'profile', element: <div><Profile/></div> },
      { path: 'UserInquiries', element: <div><UserInquiries/></div> },
      { path: 'admin', element: <ProtectedRoute role="admin"><div>dg</div></ProtectedRoute> },
      { path: 'add-new-product', element: <ProtectedRoute role="admin"><div>dg</div></ProtectedRoute> },
      { path: 'manage-products', element: <ProtectedRoute role="admin"><div>dg</div></ProtectedRoute> },
      { path: 'update-product/:id', element: <ProtectedRoute role="admin"><div>dg</div></ProtectedRoute> },
      { path: 'UserManage', element: <ProtectedRoute role="admin"><div><UserManage/></div></ProtectedRoute> },
      { path: 'ReviewManage', element: <ProtectedRoute role="admin"><div><ReviewManage/></div></ProtectedRoute> },
      { path: 'InquiryManage', element: <ProtectedRoute role="admin"><div><InquiryManage/></div></ProtectedRoute>},
      { path: 'FAQManage', element: <ProtectedRoute role="admin"><div><FAQManage/></div></ProtectedRoute>}
    ]
  }
]);

export default router;
