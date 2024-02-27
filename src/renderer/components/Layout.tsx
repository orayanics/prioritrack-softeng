import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './navbar';

function Layout({onLogout}) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout action
    localStorage.removeItem('authenticated');
    onLogout(); // Notify parent component that logout is performed
    navigate('/login');
  };
  
  return (
    // <>
    //   {location.pathname !== '/login' && <Navbar />}
    //   <Outlet />
    // </>
    <div>
    {location.pathname !== '/login' && <Navbar onLogout={handleLogout} />}
    <Outlet/>
  </div>
  );
}

export default Layout;
