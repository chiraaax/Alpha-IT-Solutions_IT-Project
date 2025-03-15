import React from 'react';
import { useNavigate } from 'react-router-dom';
import home4 from '../assets/home1.png';

// Import icons from react-icons
import { MdLaptop, MdMonitor, MdKeyboard, MdMouse, MdStorage } from 'react-icons/md';
import { FaMicrochip, FaVolumeUp, FaHdd, FaPlug, FaFan } from 'react-icons/fa';
import { GiCircuitry, GiBatteryPack } from 'react-icons/gi';
import { BsFillMotherboardFill } from "react-icons/bs";
import { RiRamLine } from "react-icons/ri";
import { LuPcCase } from "react-icons/lu";

const sidebarItems = [
  { label: 'Laptop', path: 'laptop', icon: <MdLaptop className="text-4xl" /> },
  { label: 'Motherboard', path: 'motherboards', icon: <BsFillMotherboardFill className="text-4xl" /> },
  { label: 'Processor', path: 'processor', icon: <FaMicrochip className="text-4xl" /> },
  { label: 'RAM', path: 'ram', icon: <RiRamLine className="text-4xl" /> },
  { label: 'Graphic Cards', path: 'gpu', icon: <GiCircuitry className="text-4xl" /> },
  { label: 'Power Supply Units', path: 'powerSupply', icon: <FaPlug className="text-4xl" /> },
  { label: 'Casings', path: 'casings', icon: <LuPcCase className="text-4xl" /> },
  { label: 'Monitors', path: 'monitors', icon: <MdMonitor className="text-4xl" /> },
  { label: 'CPU Coolers / AIO', path: 'cpu coolers', icon: <FaFan className="text-4xl" /> },
  { label: 'Keyboard', path: 'keyboard', icon: <MdKeyboard className="text-4xl" /> },
  { label: 'Mouse', path: 'mouse', icon: <MdMouse className="text-4xl" /> },
  { label: 'Sound Systems', path: 'sound systems', icon: <FaVolumeUp className="text-4xl" /> },
  { label: 'Cables & Connectors', path: 'cables and connectors', icon: <FaPlug className="text-4xl" /> },
  { label: 'Storage', path: 'storage', icon: <MdStorage className="text-4xl" /> },
  { label: 'External Storage', path: 'external storage', icon: <FaHdd className="text-4xl" /> },
];


const Hero = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products/${category}`);
  };

  return (
    <div
      className="bg-black text-white min-h-screen flex mb-auto"
    //   style={{
    //     borderImage: 'linear-gradient(to right, #7f1d1d, blue) 1',
    //   }}
    >
      {/* Sidebar */}
      <aside className="bg-black p-3 h-screen max-h-[80vh] overflow-y-auto custom-scrollbar">
        <nav className="flex flex-col space-y-2">
          <button
            onClick={() => navigate('/AI-Engine')}
            className="bg-gradient-to-r from-red-900 to-blue-700 min-w-90 text-white flex flex-col p-3 text-sm hover:bg-gradient-to-r hover:from-blue-700 hover:to-red-900 cursor-pointer"
            style={{
              border: '2px solid',
              borderImage: 'linear-gradient(to right, red, navy) 1',
              borderRadius: '0px',
              transition: 'all 0.3s ease-in-out',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div
              className="mt-2 text-3xl"
              style={{
                background: 'white',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontStyle: 'italic',
                fontWeight: 'bold',
              }}
            >
              <div className="mt-2 uppercase">The AI Engine</div>
            </div>
          </button>

          <br />

          {sidebarItems.map((item, index) => (
            <button
                key={index}
                onClick={() => handleCategoryClick(item.path)}
                className="group button_sidebar bg-gray-900 min-w-90 text-white flex items-center justify-start p-4 hover:bg-gray-700 cursor-pointer"
                style={{ position: 'relative' }}
            >
                <div className="relative mt-2 uppercase flex items-center gap-2">
                <span className="transition-all duration-700 opacity-100 group-hover:opacity-0">
                    {item.label}
                </span>
                <span className="absolute left-0 transition-all duration-700 opacity-0 group-hover:opacity-100">
                    {item.icon}
                </span>
                </div>
            </button>
        ))}


          <br />

          <button
            className="bg-gradient-to-r from-gray-900 via-blue-500 to-blue-1000 min-w-90 text-gray-100 flex flex-col p-3 text-sm hover:bg-gradient-to-r hover:from-gray-900 hover:via-blue-500 hover:to-blue-1000 cursor-pointer"
            style={{
              borderRadius: '0px',
            }}
          >
            <div
              className="mt-2 text-3xl"
              style={{
                fontStyle: 'italic',
                fontWeight: 'bold',
              }}
            >
              Custom Pre-builds
            </div>
            <p className="text-gray-200">- Build your dream PC -</p>
          </button>
        </nav>
      </aside>

      {/* Main Hero Content */}
      <div className="flex-1">
        <div className="container mx-auto px-10 pt-9 pb-auto relative">
          <img src={home4} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
