import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
import { AccordionItem } from 'react-bootstrap';

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [prevActivePage, setPrevActivePage] = useState('Dashboard');
  const [prevLoc, setPrevLoc] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeClient, setActiveClient] = useState('');
  const [activeDoc, setActiveDoc] = useState('');

  console.log(`Location: ${activePage}`);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authenticated');
    if (isAuthenticated) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setActivePage('Dashboard');
    localStorage.setItem('authenticated', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActivePage('Login');
    localStorage.removeItem('authenticated');
  };

  return (
    <Router>
      <Routes>
        {/* account components no need for authentication */}
        <Route
          path="/changepass/:id"
          element={<ChangePass setActivePage={setActivePage} />}
        />
        <Route path="/forgotpass" element={<ForgotPass />} />

        {/* Default route for logged in users */}
        {isLoggedIn ? (
          <Route
            element={
              <Layout
                onLogout={handleLogout}
                activePage={activePage}
                setActivePage={setActivePage}
                prevActivePage={prevActivePage}
                setPrevActivePage={setPrevActivePage}
              />
            }
          >
            <Route
              path="/"
              element={
                <Dashboard
                  setActivePage={setActivePage}
                  setPrevActivePage={setPrevActivePage}
                />
              }
            />
            <Route
              path="/document/edit/:id"
              element={<EditDoc setActiveDoc={setActiveDoc} />}
            />

            <Route
              path="/Reports"
              element={<Reports setActivePage={setActivePage} />}
            />
            <Route
              path="/client"
              element={
                <ManageClients
                  activeClient={activeClient}
                  setActiveClient={setActiveClient}
                  setPrevActivePage={setPrevActivePage}
                />
              }
            />
            <Route
              path="/client/add"
              element={<AddClient setActiveClient={setActiveClient} />}
            />

            <Route
              path="/client/document/:id"
              element={<AddDocument setActiveDoc={setActiveDoc} />}
            />
            <Route
              path="/client/detail/:id"
              element={
                <ManageDocuments
                  setActivePage={setActivePage}
                  activeDoc={activeDoc}
                  setActiveDoc={setActiveDoc}
                  setPrevLoc={setPrevLoc}
                  prevActivePage={prevActivePage}
                  setPrevActivePage={setPrevActivePage}
                />
              }
            />

            <Route
              path="/client/edit/:id"
              element={
                <UpdateClient
                  setActiveClient={setActiveClient}
                  prevLoc={prevLoc}
                />
              }
            />
          </Route>
        ) : (
          <Route
            path="/"
            element={
              <Login onLogin={handleLogin} setActivePage={setActivePage} />
            }
          />
        )}
      </Routes>
    </Router>
  );
}
