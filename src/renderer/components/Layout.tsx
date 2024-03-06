import { Outlet, useLocation, useNavigate, redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './navbar';

function Layout({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  // REFRESH ON SAME PAGE
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('lastPathname', location.pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';
    const lastPathname = localStorage.getItem('lastPathname');

    if (isAuthenticated && lastPathname) {
      navigate(lastPathname);
      localStorage.removeItem('lastPathname');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    onLogout();
    navigate('/login');
  };

  return (
    <div>
      {location.pathname !== '/login' && <Navbar onLogout={handleLogout} />}
      <Outlet />
    </div>
  );
}

export default Layout;
