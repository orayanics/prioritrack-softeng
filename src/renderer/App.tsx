import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import Layout from './components/Layout';
// import Home from './pages/Home';

// CLIENT SIDE
import Reports from './pages/Reports';
import Dashboard from './pages/Dashboard';
import AddClient from './pages/client/AddClient';
import ReadClient from './pages/client/ReadClient';
import ManageClients from './pages/client/ManageClients';
import './styles/globals.scss';
import UpdateClient from './pages/client/UpdateClient';
import List from './pages/client/List'

// DOCUMENT SIDE
import ManageDocuments from './pages/client/ManageDocuments';
import AddDocument from './pages/document/AddDocument';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/Reports" element={<Reports />} />
          <Route path="/client" element={<ManageClients />} />
          <Route path="/client/add" element={<AddClient />} />
          <Route path="/client/document/:id" element={<AddDocument />} />
          <Route path="/client/detail/:id" element={<ManageDocuments />} />

          <Route path="/client/edit/:id" element={<UpdateClient />} />
        </Route>
      </Routes>
    </Router>
  );
}
