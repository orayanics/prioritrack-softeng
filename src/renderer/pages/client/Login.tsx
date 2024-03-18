import React from 'react';
// import logo from '../assets/logo.png';
import styles from '../../styles/login.module.scss';
function Login(): JSX.Element {
  return (
    <body>
      {/* <img src={logo} alt="logo" className={styles.logo} /> */}
      <div className={`${styles.cardContainer}`}>
        <div className={`${styles.card}`}>
          <div className={styles.login}>
            <h2 className={styles.h2}>Login</h2>
          </div>
          <form className={styles.form}>
            <label htmlFor="username">Username</label>
            <input
              className={styles.input}
              type="text"
              id="username"
              name="username"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              className={styles.input}
              type="password"
              id="password"
              name="password"
              required
            />

            <button type="submit" className={styles.button}>
              Login
            </button>
          </form>
          <p className={styles.forgotPassword}>
            <a href="../renderer/forgotpass.html" className={styles.forgotLink}>
              Forgot your password?
            </a>
          </p>
        </div>
      </div>
    </body>
  );
}

export default Login;
