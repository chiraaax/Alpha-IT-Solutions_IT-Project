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
import AdminProfile from '../components/Register/AdminProfile';

//Product Components
import AddProduct from '../pages/dashboard/admin/addProduct/AddProduct';
import ManageProducts from '../pages/dashboard/admin/manageProducts/ManageProducts';
import ManageInventory from '../pages/dashboard/admin/inventoryManagement/ManageInventory';
import ProductDetails from '../components/shop/ProductDetails';
import SearchPage from '../components/shop/search/SearchPage';
import ManageAppointments from "../pages/dashboard/manage-appointments";

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
import AICustomizeBuild from '../components/CustomBuilds/AICustomizeBuild'; 
import PreBuildDashboard from "../components/CustomBuilds/PreBuildDashboard";
import EditCustomPreBuild from '../components/CustomBuilds/EditCustomPreBuild';
import AdminFiltersPage from '../pages/dashboard/admin/filterProducts/AdminFiltersPage';


//order management
import ShoppingCart from '../pages/OrderManagement/ShoppingCart';
import CheckoutForm from '../components/OrderManagement/CheckoutForm';
import PickupForm from '../components/OrderManagement/pickupForm';
import CodForm from '../components/OrderManagement/CodForm';
import CatalogReportInline from '../pages/dashboard/user/shop/report/CatalogReportInline ';
// import OrderList from '../components/OrderManagement/OrderList';
import CustomizeBuild from '../components/CustomBuilds/CustomizeBuild'; // ✅ New Import
import FilterForm from '../pages/dashboard/admin/filterProducts/FilterForm';
import FiltersList from '../pages/dashboard/admin/filterProducts/FiltersList';

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
    
      { path: 'faq', element: <FAQ /> },
      { path: 'ReviewForm', element:<ReviewForm/>},
      { path: 'UserReviews', element:<UserReviews/>},
      { path: 'InquiryForm', element:<InquiryForm/>},
      { path: 'UserInquiries', element:<UserInquiries/>},
      { path: 'profile', element: <Profile/>},

      // CustomBuilds routes
      { path: 'custom-prebuilds', element: <CustomPreBuilds /> },
      { path: 'shop/:productId', element: <ProductDetails /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'gaming-builds', element: <GamingBuilds /> },
      { path: 'budget-builds', element: <BudgetBuilds /> },        
      { path: 'gaming-builds/:id', element: <GamingBuildDetail /> },
      
      //order routes
      { path: 'ShoppingCart', element: <ProtectedRoute><ShoppingCart /></ProtectedRoute> },
      { path: 'CheckoutForm', element: <ProtectedRoute><CheckoutForm /></ProtectedRoute> },
      { path: 'CheckoutForm/:email', element: <ProtectedRoute><CheckoutForm /></ProtectedRoute> },
      { path: 'PickupForm', element: <ProtectedRoute><PickupForm /></ProtectedRoute> },
      { path: 'CodForm', element: <ProtectedRoute><CodForm /></ProtectedRoute> },
      { path: 'budget-builds/:id', element: <BudgetBuildDetail /> },  
      { path: 'edit-custom-pre-build/:id', element: <EditCustomPreBuild /> }, 
       // Updated route for your custom dashboard
      { path: 'ai-customize-build', element: <AICustomizeBuild /> }, 
      { path: 'edit-custom-pre-build/:id', element: <EditCustomPreBuild /> }, // ✅ New Route
      { path: 'prebuild-dashboard', element: <ProtectedRoute><PreBuildDashboard /></ProtectedRoute>  }, // Updated route for your custom dashboard
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
      { path: 'report-shop', element: <CatalogReportInline/> },
      
      { path: 'profile', element: <div><Profile/></div> },
      { path: 'UserInquiries', element: <div><UserInquiries/></div> },
      { path: 'UserReviews', element:<div><UserReviews/></div>},

      // Admin routes
      { path: 'admin', element: <ProtectedRoute allowedRoles={["admin"]}><div>Admin Panel</div></ProtectedRoute> },
      { path: 'add-new-product', element: <ProtectedRoute allowedRoles={["admin"]}><AddProduct /></ProtectedRoute> },
      { path: 'manage-products', element: <ProtectedRoute allowedRoles={["admin"]}><ManageProducts /></ProtectedRoute> },
      { path: 'manage-inventory', element: <ProtectedRoute allowedRoles={["admin"]}><ManageInventory /></ProtectedRoute> },
      { path: 'UserManage', element: <ProtectedRoute allowedRoles={["admin"]}><div><UserManage/></div></ProtectedRoute> },
      { path: 'manage-appointments', element: <ProtectedRoute allowedRoles={["admin"]}><ManageAppointments /></ProtectedRoute> },
      { path: 'filters', element: <ProtectedRoute allowedRoles={["admin"]}>< AdminFiltersPage/></ProtectedRoute> },
      { path: 'create-custom-prebuild', element: <ProtectedRoute allowedRoles={["admin"]}><CreateCustomBuild /></ProtectedRoute> },
      { path: 'prebuild-dashboard', element: <ProtectedRoute allowedRoles={["admin"]}><PreBuildDashboard /></ProtectedRoute>  },
      { path: 'ReviewManage', element: <ProtectedRoute allowedRoles={["admin"]}><div><ReviewManage/></div></ProtectedRoute> },
      { path: 'InquiryManage', element: <ProtectedRoute allowedRoles={["admin"]}><div><InquiryManage/></div></ProtectedRoute>},
      { path: 'FAQManage', element: <ProtectedRoute allowedRoles={["admin"]}><div><FAQManage/></div></ProtectedRoute>},
      { path: 'AdminProfile', element: <ProtectedRoute allowedRoles={["admin"]}><div><AdminProfile/></div></ProtectedRoute>},
      
    ]
  }
]);

export default router;
