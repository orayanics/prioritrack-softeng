import React, { FC } from 'react';
import '../styles/navbar.css';
import navlogo from '../assets/navlogo.png';
import { Outlet, Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={navlogo} alt="Prioritrack " />
      </div>
      <div className="navbar-links">
        <Link to={`/home`}>Dashboard</Link>
        {/* <Link to={`/`}>Root</Link> */}
        <a href="#">Reports</a>
        <Link to={`/add`}>Add</Link>

        <a href="#">Logout</a>
      </div>
    </nav>
  );
}