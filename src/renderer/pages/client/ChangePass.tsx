import React from 'react';
import Axios from 'axios';
import styles from '../../styles/change_pass.module.scss';
import logo from '../../assets/prioritrack-logo-with-text.svg';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IoEyeSharp, IoEyeOffSharp } from 'react-icons/io5';

function ChangePass(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const toggleNewPassVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };
  const toggleConfirmNewPassVisibility = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      const response = await Axios.post(
        `http://localhost:3001/user/edit/${id}`,
        {
          password: newPassword,
        },
      );
      console.log('Password updated successfully');
      navigate('/login');
    } catch (error) {
      setError(`Error updating password: ${error}`);
      console.error('Error updating password:', error);
    }
  };

  return (
    <div className={styles.bg}>
      <div className={styles.bgImage}></div>
      <div className={styles.logo}>
        <img src={logo} />
      </div>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <center>
              <h2 className={styles.title}>Change Password</h2>
            </center>
            <form onSubmit={handleSubmit}>
              <label htmlFor="newpass" className={styles.label}>
                New Password
              </label>
              <div className={styles.inputPassContainer}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newpass"
                  name="newpass"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.passToggle}
                  onClick={toggleNewPassVisibility}
                >
                  {showNewPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
                </button>
              </div>

              <label htmlFor="confirmpass" className={styles.label}>
                Confirm New Password
              </label>
              <div className={styles.inputPassContainer}>
                <input
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  id="confirmpass"
                  name="confirmpass"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.passToggle}
                  onClick={toggleConfirmNewPassVisibility}
                >
                  {showConfirmNewPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
                </button>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <div className={styles.buttonContainer}>
                <center>
                  <button
                    type="submit"
                    className={`${styles.button} ${styles.verifyButton}`}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className={`${styles.button} ${styles.cancelButton}`}
                  >
                    <Link to={`/login`} className={styles.cancel_text}>
                      Cancel
                    </Link>
                  </button>
                </center>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePass;
