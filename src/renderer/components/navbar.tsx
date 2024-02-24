import React, { FC } from 'react';
import '../styles/navbar.css';
import navlogo from '../assets/navlogo.png';
import { Outlet, Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import Dropdown from 'react-bootstrap/Dropdown';

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

        <Dropdown>
          <Dropdown.Toggle variant="success" id="notification-dropdown">
            <FaBell />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/notification-1">
              Notification 1
            </Dropdown.Item>
            <Dropdown.Item href="#/notification-2">
              Notification 2
            </Dropdown.Item>
            <Dropdown.Item href="#/notification-3">
              Notification 3
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

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
