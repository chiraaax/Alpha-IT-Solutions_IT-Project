import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Fixed import
import { MdSearch, MdShoppingCart, MdAccountCircle } from 'react-icons/md';
import logo from '../assets/AlphaITSolutionsLogo.jpg';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // If scrolling down, hide navbar
        setIsVisible(false);
      } else {
        // If scrolling up, show navbar
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`pb-auto w-full bg-gray-100 border-black transition-transform duration-500 z-50 shadow-lg ${
        isVisible ? 'fixed top-0 left-0 translate-y-0' : 'fixed top-0 left-0 -translate-y-full'
      }`}
    >
      <nav className='max-w-screen-xl mx-auto px-5 flex justify-between items-center py-2'>
        
        {/* Logo */}
        <div className='pr-5 pl-10 max-w-35 max-h-35'>
          <img src={logo} alt="Alpha IT Solutions" />
        </div>

        <div className='nav__logo pr-80'>
          <Link to="/"><span>A</span>LPHA <span>I</span>T <span>S</span>OLUTIONS</Link>
        </div>
        
        <ul className='nav__links flex gap-6'>
          <li className='link'><Link to="/about">About</Link></li>
          <li className='link'><Link to="/appointment">Services</Link></li>
          <li className='link'><Link to="/">Reviews</Link></li>
          <li className='link'><Link to="/contact">Contact</Link></li>
        </ul>

        <div className='nav__icons flex items-center gap-4'>
          {/* Search Icon */}
          <Link to="/search">
            <MdSearch size={24} />
          </Link>
          
          {/* Cart Icon */}
          <Link to="/ShoppingCart" className="relative">
            <MdShoppingCart size={24} />
            <sup className='absolute -top-2 -right-2 text-xs inline-block px-1.5 text-white rounded-full bg-primary'>
              {/* {products.length} */}
            </sup>
          </Link>
          
          {/* User Profile Icon */}
          <Link to="/profile">
            <MdAccountCircle size={24} />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
