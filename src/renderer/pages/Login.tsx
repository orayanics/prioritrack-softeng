import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // Make sure axios is imported
import styles from '../styles/login.module.scss';
function Login({ onLogin }) {
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
        localStorage.setItem('authenticated', 'true');
        onLogin(); // Notify parent component that login is successful
        navigate('/home');
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
      setError('Invalid username or password');
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
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
