import React from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import video from '../assets/banner-video.mp4';
import bannerLeft from '../assets/banner-left.avif';
import bannerRight from '../assets/banner-right.png';

/** Sidebar product list */
const sidebarItems = [
    { label: 'Console & Handheld Gaming', path: '/gaming-consoles' },
    { label: 'Graphics Tablets', path: '/graphics-tablets' },
    { label: 'Laptop', path: '/laptops' },
    { label: 'Processor', path: '/processors' },
    { label: 'Motherboards', path: '/motherboards' },
    { label: 'Memory (RAM)', path: '/memory-ram' },
    { label: 'Graphics Card', path: '/graphics-cards' },
    { label: 'Power Supply, UPS', path: '/power-supply' },
    { label: 'Cooling & Lighting', path: '/cooling-lighting' },
    { label: 'Storage & NAS', path: '/storage' },
    { label: 'Casings', path: '/casings' },
    { label: 'Monitors', path: '/monitors' },
    { label: 'Speakers, Headsets & Ear-Buds', path: '/audio-devices' },
    { label: 'Keyboard, Mouse & Gamepad', path: '/input-devices' },
    { label: 'Gaming Chairs', path: '/gaming-chairs' },
    { label: 'Smartphones', path: '/smartphones' },
    { label: 'Cameras', path: '/cameras' },
    { label: 'Home Appliances', path: '/home-appliances' },
    { label: 'Software & Licenses', path: '/software' },
    { label: 'Networking', path: '/networking' },
    { label: 'Printers & Scanners', path: '/printers-scanners' },
    { label: 'Projectors', path: '/projectors' },
    { label: 'Routers', path: '/routers' },
    { label: 'VR Headsets', path: '/vr-headsets' },
    { label: '3D Printers', path: '/3d-printers' },
    { label: 'E-Book Readers', path: '/ebook-readers' },
];


const Hero = () => {
  return (
    // Products sidebar
    <div className="bg-black text-white min-h-screen flex">
      {/* Sidebar */}
      <aside className="bg-black p-2 h-screen overflow-y-auto custom-scrollbar">
  <nav className="flex flex-col space-y-2">
    {sidebarItems.map((item, index) => (
      <Link
        key={index}
        to={item.path} // Use the path dynamically
        className="bg-gray-900 min-w-90 text-white flex flex-col items p-3 text-sm hover:bg-blue-700 cursor-pointer"
      >
        <div className="mt-2 text-xl">{item.label}</div>
      </Link>
      ))}
    </nav>
  </aside>


      {/* Main Hero Content */}
      <div className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-10 pb-16 relative">
          {/* Subtitle */}
          {/* <div className="mb-6">
            <span className="text-[#999999] uppercase tracking-[0.2em] text-sm font-medium">
              MORE THAN A WEBSITE BUILDER
            </span>
          </div> */}

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-8xl font-bold mb-8 md:mb-16 leading-[1.1] tracking-[-0.02em]">
            Your site should do <br className="md:block hidden" /> more than look good
          </h1>

          <div className="flex md:flex-row items-center flex-col justify-between gap-8">
            {/* Description */}
            {/* <p className="text-[#999999] md:text-xl mb-8 md:mb-0 leading-relaxed max-w-xl">
              As the first-ever website experience platform, CodeTutor lets marketers, designers, and developers
              come together to build, manage, and optimize web experiences that get results.
            </p> */}

            {/* CTA Buttons */}
            <div className="flex sm:flex-row flex-wrap gap-8 shrink-0">
              <Link
                to="/start-building"
                className="bg-[#4353FF] hover:bg-[#3544CC] text-white px-8 py-4 rounded text-lg font-medium transition-colors duration-200"
              >
                Start building
              </Link>
              <Link
                to="/contact-sales"
                className="group flex items-center text-white hover:text-[#999999] transition-colors duration-200 text-lg font-medium"
              >
                Contact sales
                <HiArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          {/* Video Section */}
          <div className="w-full h-full mt-16 relative">
            <video
              src={video}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1/2 xl:-left-20 md:-left-0 z-20 xl:block hidden">
              <img
                src={bannerLeft}
                alt=""
                className="lg:h-32 md:h-24 h-20 w-full object-cover"
              />
            </div>
            <div className="absolute bottom-1/5 xl:-right-20 md:-right-0 z-20 xl:block hidden">
              <img
                src={bannerRight}
                alt=""
                className="lg:h-44 md:h-32 h-28 w-full object-cover"
              />
            </div>
          </div>

          {/* Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 z-10 bg-gradient-to-t from-black to-transparent hidden md:block"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
