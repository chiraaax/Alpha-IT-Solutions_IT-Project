import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import GamingConsoles from '../pages/sidebarProducts/GamingConsoles';

// Define the router object
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,  // App is the layout (Navbar + Outlet + Footer)
    children: [
      { path: '', element: <Home /> },
      { path: 'gaming-consoles', element: <GamingConsoles /> },
      // { path: 'laptops', element: <Laptops /> },
      // { path: 'processors', element: <Processors /> },
      // Add other routes here...
    ]
  }
]);

export default router; 
