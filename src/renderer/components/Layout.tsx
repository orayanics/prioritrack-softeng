import { Outlet, Link } from 'react-router-dom';
import Home from '../App';

function Layout() {
  return (
    <>
      <div>This is the layout. Put Navigation here</div>
      <button>
        <Link to={`/`}>Root</Link>
      </button>

      <button>
        <Link to={`/home`}>Dashboard</Link>
      </button>
      <button>
        <Link to={`/add`}>Add</Link>
      </button>
      <Outlet />
    </>
  );
}

export default Layout;
