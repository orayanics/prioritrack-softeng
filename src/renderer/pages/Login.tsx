import React, { useState } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import axios from 'axios'; // Make sure axios is imported
import styles from '../styles/login.module.scss';
import logo from '../assets/prioritrack-logo-with-text.svg';
import { IoEyeSharp, IoEyeOffSharp } from 'react-icons/io5';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [successMessageLogin, setsuccessMessageLogin] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const togglePassVisibility = () => {
    setShowPassword(!showPassword);
    console.log(showPassword);
  };

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
        onLogin();
        navigate('/home', {
          state: { successMessageLogin: 'Login successfully!' },
        });
      } else {
        console.error('Error occurred during login:', error);
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.bg}>
      <div className={styles.bgImage}></div>
      <div className={styles.logo}>
        <img src={logo} />
      </div>
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
            <div className={`${styles.inputPassContainer} ${styles.flex}`}>
              <input
                className={`${styles.input} ${styles.passInput}`}
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.passToggle}
                onClick={togglePassVisibility}
              >
                {showPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
              </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className={styles.forgotPassword}>
            <Link to="/forgotpass" className={styles.forgotLink}>
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
