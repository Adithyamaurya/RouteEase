import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';
const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          
          <Link to="/" className="navbar-brand">
          RouteEase
          </Link>
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
            <Link to="/upcoming-routes" className="navbar-link">Upcoming Routes</Link>
            {isAuthenticated && (
              <Link to="/my-bookings" className="navbar-link">My Bookings</Link>
            )}
            <Link to="/help" className="navbar-link">Help</Link>
            <Link to="/contact" className="navbar-link">Contact</Link>
            {isAuthenticated ? (
              <>
                <button
                  className="navbar-profile"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/profile');
                  }}
                >
                  <span className="navbar-avatar">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                  <span className="navbar-username">{user?.name}</span>
                </button>
              </>
            ) : (
              <>

                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

