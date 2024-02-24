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
        {/* <Link to={`/client/add`}>Add Client</Link> */}

        <Link to={`/home`}>Dashboard</Link>

        <Link to="/reports">Reports</Link>
        <Link to={`/client`}>Clients</Link>
        {/* <Link to={`/document/edit/:id`}>Edit Document</Link> */}
        {/* <Link to={`/client/document/:id`}>Add Document</Link> */}
        {/* <Link to={`/`}>Logout</Link> */}
        {/* <Link to={`/changepass`}>Change Pass</Link>
        <Link to={`/forgotpass`}>forgot</Link> */}

        <a href="#">Logout</a>
      </div>
    </nav>
  );
}
