import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import Layout from './components/Layout';
// import Home from './pages/Home';
import Home from './pages/Dashboard';

import Add from './pages/client/Add';
import Read from './pages/client/Read';
import './styles/globals.scss';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/add" element={<Add />} />
          <Route path="/list/:id" element={<Read />} />
          {/* <Route path="/list/edit/:id" element={<Update />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}
