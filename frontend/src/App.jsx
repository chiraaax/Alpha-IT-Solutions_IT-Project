import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from "react-toastify"; // ✅ Import ToastContainer
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Break from './components/Break';
import './App.css';
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Navbar />
      <Break />
      <ToastContainer position="top-right" autoClose={3000} /> {/* Ensure this is imported */}
      <Outlet />  {/* This is where page content (e.g., Home) will render */}
      <Footer />
    </>
  );
}

export default App;
