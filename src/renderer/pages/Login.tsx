import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/login.module.scss';
import { useNavigate, Link, Outlet } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });
      console.log(response.data);
      if (response.data) {
        navigate('/home');
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div className={styles.login}>
          <h2 className={styles.h2}>Login</h2>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            className={styles.input}
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            className={styles.input}
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
        <p className={styles.forgotPassword}>
          <Link to="/forgotpass" className={styles.forgotLink}>
            Link to forgot
          </Link>
        </p>
      </div>
      <Outlet/>
    </div>
  );
}
