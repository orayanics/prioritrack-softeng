import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import Layout from './components/Layout';
// import Home from './pages/Home';

// CLIENT SIDE
import Dashboard from './pages/Dashboard';
import AddClient from './pages/client/AddClient';
import Read from './pages/client/ReadClient';
import ManageClients from './pages/client/ManageClients';
import './styles/globals.scss';
import Update from './pages/client/Update';
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
          <Route path="/client/add" element={<AddClient />} />
          <Route path="/client/document/:id" element={<AddDocument />} />
          <Route path="/list/:id" element={<Read />} />
          {/* <Route path="/client" element={<ManageDocuments />} /> */}
          {/* <Route path="/client" element={<List />} /> */}
          <Route path="/client" element={<ManageClients />} />
          <Route path="/client/list/:id" element={<ManageDocuments />} />


          <Route path="/list/edit/:id" element={<Update />} />
        </Route>
      </Routes>
    </Router>
  );
}
