import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import facebook from '../assets/facebook.png';
import twitter from '../assets/twitter.png';
import instagram from '../assets/instagram.jpg';
import linkedin from '../assets/linkedin.png';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🚌 BusBooking</h3>
            <p>Your trusted partner for comfortable and safe bus travel. Book your tickets with ease and enjoy your journey.</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <span><img src={facebook} alt="Facebook" /></span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <span><img src={twitter} alt="Twitter" /></span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <span><img src={instagram} alt="Instagram" /></span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <span><img src={linkedin} alt="LinkedIn" /></span>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/buses">Search Buses</Link></li>
              <li><Link to="/upcoming-routes">Upcoming Routes</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/help">Help & FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <ul className="contact-info">
              <li>
                <a href='tel:+91 83569 61950'>+91 83569 61950</a>
              </li>
              <li>
                <a href='mailto:support@routeease.com'>support@routeease.com</a>
              </li>
              <li>
                <a href='https://maps.app.goo.gl/9YZ99999999999999'>402, SPIT, Andheri(W) Mumbai 400059 </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} RouteEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

