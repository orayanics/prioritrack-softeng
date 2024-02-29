import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import Layout from './components/Layout';
import { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Home from './pages/Home';

// CLIENT SIDE
import Reports from './pages/Reports';
import Dashboard from './pages/Dashboard';
import AddClient from './pages/client/AddClient';
import ManageClients from './pages/client/ManageClients';
import './styles/globals.scss';
import UpdateClient from './pages/client/UpdateClient';
import ChangePass from './pages/client/ChangePass';
import ForgotPass from './pages/client/ForgotPass';
// DOCUMENT SIDE
import ManageDocuments from './pages/client/ManageDocuments';
import AddDocument from './pages/document/AddDocument';
import Login from './pages/Login';
import EditDoc from './pages/document/EditDocument';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  return (
    <Router>
      <Routes>
        {/* account components no need for authentication */}
        <Route path="/changepass" element={<ChangePass />} />
        <Route path="/forgotpass" element={<ForgotPass />} />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Layout onLogout={handleLogout} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        >
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          {/* MEDJ PROBLEMATIC ATA TO */}
          <Route path="/home" element={<Dashboard />} />

          <Route path="/document/edit/:id" element={<EditDoc />} />

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
