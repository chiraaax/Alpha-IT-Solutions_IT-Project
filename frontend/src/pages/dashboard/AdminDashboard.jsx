import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import '../../styles/admin_dashboard.css'// Import the CSS file

const navItems = [
  { path: '/dashboard/admin', label: 'Dashboard' },
  { path: '/dashboard/add-new-product', label: 'Add Product' },
  { path: '/dashboard/manage-products', label: 'Manage Products' },
  { path: '/dashboard/manage-inventory', label: 'Manage Products Inventory' },
  { path: '/dashboard/users', label: 'Users' },
  { path: '/dashboard/manage-appointments', label: 'Manage Appointments' },
  { path: '/dashboard/manage-filters', label: 'Manage Filters' },
  { path: '/dashboard/manage-filters-db', label: 'Manage Filters db' },
  { path: '/dashboard/create-custom-prebuild', label: 'Create Custom Prebuild' },
];

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className='admin-dashboard'>
      <div>
        <div className='nav__logo'>
          <Link to="/">Alpha IT Solutions<span>.</span></Link><hr></hr>
          <p className='italic mt-4 text-gray-500'>Admin dashboard</p>
        </div>
        <hr />
        <ul className='nav-items'>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                className={({ isActive }) => isActive ? "active" : ''} 
                end
                to={item.path}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <hr />
        <button
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;