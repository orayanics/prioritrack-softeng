import React, { FC } from 'react';
import '../styles/navbar.css';
import navlogo from '../assets/navlogo.png';
import { Outlet, Link } from 'react-router-dom';

export default function Navbar({onLogout}) {
  const handleLogout = () => {
    onLogout();
  };
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={navlogo} alt="Prioritrack " />
      </div>
      <div className="navbar-links">
        <Link to="/reports">Reports</Link>
        <Link to={`/home`}>Dashboard</Link>
        <Link to="/reports">Reports</Link>
        <Link to={`/client`}>Clients</Link>
        <a href="#" onClick={handleLogout}>Logout</a>
      </div>
    </nav>
  );
}
