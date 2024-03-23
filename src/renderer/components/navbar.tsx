import React, { FC, useState, useEffect } from 'react';
import '../styles/navbar.css';
import navlogo from '../assets/navlogo.png';
import { Link, useLocation } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import Dropdown from 'react-bootstrap/Dropdown';
import Notif from './Notif';
import ConfirmLogoutModal from './ConfirmLogoutModal';

export default function Navbar({ onLogout }) {
  const location = useLocation();
  const [activePage, setActivePage] = useState('');

  useEffect(() => {
    const pathnameSegments = location.pathname.split('/');
    const lastSegment = pathnameSegments[pathnameSegments.length - 1];
    setActivePage(lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1));
  }, [location.pathname]);

  const handleLogout = () => {
    onLogout();
    setIsModalOpen(false); // Close the modal after logout
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLinkClick = (pageName) => {
    setActivePage(pageName);
  };

  return (
    <nav className="navbar">
      <Link
        to="/home"
        onClick={() => handleLinkClick('Dashboard')}
        className="navbar-logo"
      >
        <img src={navlogo} alt="Prioritrack " />
      </Link>
      <div className="navbar-links">
        <Link
          to="/home"
          onClick={() => handleLinkClick('Dashboard')}
          className={`link ${activePage === 'Dashboard' && 'active'}`}
        >
          Dashboard
        </Link>
        <Link
          to="/reports"
          onClick={() => handleLinkClick('Reports')}
          className={`link ${activePage === 'Reports' && 'active'}`}
        >
          Reports
        </Link>
        <Link
          to="/client"
          onClick={() => handleLinkClick('Clients')}
          className={`link ${activePage === 'Clients' && 'active'}`}
        >
          Clients
        </Link>
        <a href="#" onClick={() => setIsModalOpen(true)} className="link">
          Logout
        </a>

        <Notif />
      </div>
      <ConfirmLogoutModal
        show={isModalOpen}
        handleClose={handleCloseModal}
        handleLogout={handleLogout}
      />
    </nav>
  );
}
