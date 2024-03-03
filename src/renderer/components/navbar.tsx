import React, { FC, useState } from 'react';
import '../styles/navbar.css';
import navlogo from '../assets/navlogo.png';
import { Outlet, Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import Dropdown from 'react-bootstrap/Dropdown';
import ConfirmLogoutModal from './ConfirmLogoutModal';

export default function Navbar({ onLogout }) {
  const [activePage, setActivePage] = useState('Dashboard');
  const handleLogout = () => {
    onLogout();
    setIsModalOpen(false); // Close the modal after logout
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <nav className="navbar">
      <Link
        to={`/home`}
        onClick={() => setActivePage('Dashboard')}
        className="navbar-logo"
      >
        <img src={navlogo} alt="Prioritrack " />
      </Link>
      <div className="navbar-links">
        {/* <Link to={`/client/add`}>Add Client</Link> */}
        {/* <Link to={`/`}>Root</Link> */}
        {/* <Link
          to={`/login`}
          onClick={() => setActivePage('Login')}
          className={`link ${activePage == 'Login' && 'active'}`}
        >
          Login
        </Link> */}
        {/* <Link to={`/client`}>Manage Clients</Link> */}
        <Link
          to={`/home`}
          onClick={() => setActivePage('Dashboard')}
          className={`link ${activePage == 'Dashboard' && 'active'}`}
        >
          Dashboard
        </Link>
        <Link
          to="/reports"
          onClick={() => setActivePage('Reports')}
          className={`link ${activePage == 'Reports' && 'active'}`}
        >
          Reports
        </Link>
        <Link
          to={`/client`}
          onClick={() => setActivePage('Clients')}
          className={`link ${activePage == 'Clients' && 'active'}`}
        >
          Clients
        </Link>
        {/* <Dropdown>
          <Dropdown.Toggle id="notif">
            <FaBell />
          </Dropdown.Toggle>

          <Dropdown.Menu id="notif-menu">
            <Dropdown.Item href="#/notification-1">
              BAHO NI ALIAH SOBRANG ASIM DI NALILIGO
            </Dropdown.Item>
            <Dropdown.Item href="#/notification-2">
              Notification 2
            </Dropdown.Item>
            <Dropdown.Item href="#/notification-3">
              Notification 3
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}
        {/* <Link to={`/document/edit/:id`}>Edit Document</Link> */}
        {/* <Link to={`/client/document/:id`}>Add Document</Link> */}
        {/* <Link to={`/`}>Logout</Link> */}
        {/* <Link to={`/changepass`}>Change Pass</Link>
        <Link to={`/forgotpass`}>forgot</Link> */}

        <a
          href="#"
          // onClick={handleLogout}
          onClick={() => setIsModalOpen(true)}
          className="link"
        >
          Logout
        </a>

        <div className="dropdownNav link">
          <button className="dropbtn">
            <FaBell />
          </button>
          <div className="dropdown-content">
            <a href="#">
              Notification 1
              <div className="description">
                Description Lorem ipsum dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua.
              </div>
            </a>
            <a href="#">Notification 2</a>
            <a href="#">Notification 3</a>
          </div>
        </div>
      </div>
      <ConfirmLogoutModal
        show={isModalOpen}
        handleClose={handleCloseModal}
        handleLogout={handleLogout}
      />
    </nav>
  );
}
