import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './navbar';
import Login from '../pages/Login';

function Layout() {
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('authenticated') === 'true';
    setAuthenticated(isLoggedIn);
  }, [location.pathname]);

  return (
    <>
      {location.pathname !== '/login' && authenticated && <Navbar />}
      <Outlet />
    </>
  );
}

export default Layout;
