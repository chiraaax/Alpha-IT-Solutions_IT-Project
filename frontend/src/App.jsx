import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <Outlet />  {/* This is where page content (e.g., Home) will render */}
      <Footer />
    </>
  );
}

export default App;


