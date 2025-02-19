import React from 'react';
import { Link } from 'react-router';
import { MdSearch, MdShoppingCart, MdAccountCircle, MdKeyboardArrowDown, MdMenu, MdClose } from 'react-icons/md';

const Navbar = () => {
  return (
    <header className='fixed-nav-bar w-nav'>
      <nav className='max-w-screen-2xl mx-auto px-4 flex justify-between items-center'>
        <ul className='nav__links'>
          <li className='link'><Link to="/about">About</Link></li>
          <li className='link'><Link to="/shop">Services</Link></li>
          <li className='link'><Link to="/">Reviews</Link></li>
          <li className='link'><Link to="/contact">Contact</Link></li>
        </ul>

        {/* Logo */}
        <div className='nav__logo'>
          <Link to="/">ALPHA IT SOLUTIONS<span> .</span></Link>
        </div>

        <div className='nav__icons relative flex items-center gap-4'>
          {/* Search Icon */}
          <span>
            <Link to="/search">
              <MdSearch size={24} />
            </Link>
          </span>
          
          {/* Cart Icon */}
          <span>
            <Link to="/cart" className="relative">
              <MdShoppingCart size={24} />
              <sup className='absolute -top-2 -right-2 text-xs inline-block px-1.5 text-white rounded-full bg-primary'>
                {/* {products.length} */}
              </sup>
            </Link>
          </span>
          
          {/* User Profile Icon */}
          <span>
            <Link to="/profile">
              <MdAccountCircle size={24} />
            </Link>
          </span>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
