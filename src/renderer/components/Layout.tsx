import { Outlet, Link } from 'react-router-dom';
import Home from '../App';
import Login from '../pages/Login'
import Navbar from './navbar';
function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default Layout;
