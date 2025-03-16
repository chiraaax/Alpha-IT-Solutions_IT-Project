import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdSearch, MdShoppingCart, MdAccountCircle } from 'react-icons/md';
import logo from '../assets/AlphaITSolutionsLogo.jpg';
import { AuthContext } from '../context/authContext';


const adminDropDownMenus = [
  { label: "Dashboard", path: "/dashboard/admin" },
  { label: "Manage Items", path: "/dashboard/manage-products" },
  { label: "Add Product", path: "/dashboard/add-new-product" },
];

const userDropDownMenus = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Profile", path: "/dashboard/profile" },
];

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const navigate = useNavigate();

  // Access user and logout from AuthContext
  const { user, logout } = useContext(AuthContext);

  // Debug log to check the user data
  // console.log('Current user:', user);

  // Set dropdown menus based on the logged-in user's role
  const dropDownMenus =
    user && user.role === 'admin' ? adminDropDownMenus : user ? userDropDownMenus : [];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleDropDownToggle = () => {
    setIsDropDownOpen(prev => !prev);
  };

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      console.log('Logging out...');
    }
    setIsDropDownOpen(false);
    navigate('/login');
  };

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
          <Link to="/">
            <span>A</span>LPHA <span>I</span>T <span>S</span>OLUTIONS
          </Link>
        </div>
        
        <ul className='nav__links flex gap-6'>
          <li className='link'><Link to="/about">About</Link></li>
          <li className='link'><Link to="/appointment">Services</Link></li>
          <li className='link'><Link to="/custom-prebuilds">Custom Pre-Builds</Link></li>
          <li className='link'><Link to="/">Reviews</Link></li>
          <li className='link'><Link to="/contact">Contact</Link></li>
        </ul>

        <div className='nav__icons flex items-center gap-4 relative'>
          {/* Search Icon */}
          <Link to="/search">
            <MdSearch size={24} />
          </Link>
          
          {/* Cart Icon */}
          <Link to="/ShoppingCart" className="relative">
            <MdShoppingCart size={24} />
            <sup className='absolute -top-2 -right-2 text-xs inline-block px-1.5 text-white rounded-full bg-primary'>
              {/* Optionally show the number of products */}
            </sup>
          </Link>
          
          {/* User Dropdown */}
          {user ? (
            <span className="relative">
              <MdAccountCircle
                size={24}
                onClick={handleDropDownToggle}
                className="cursor-pointer"
              />
              {isDropDownOpen && (
                <div className='absolute right-0 mt-3 p-4 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
                  <ul className='font-medium space-y-4 p-2'>
                    {dropDownMenus.map((menu, index) => (
                      <li key={index}>
                        <Link 
                          onClick={() => setIsDropDownOpen(false)}
                          className='dropdown-items'
                          to={menu.path}
                        >
                          {menu.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 shadow-md"
                      style={{
                        textAlign: "center",
                        background: "linear-gradient(to right, #d12222, #0245ff)",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                      onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                    >
                      Logout
                    </button>
                    </li>
                  </ul>
                </div>
              )}
            </span>
          ) : (
            <Link to="/login">
              <MdAccountCircle size={24} />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
