import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import Layout from './components/Layout';
import Home from './pages/Home';
import Add from './pages/UserAdd';
import Read from './pages/Read';

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
