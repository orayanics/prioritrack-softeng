import React from 'react';
import Axios from 'axios';
import styles from '../../styles/change_pass.module.scss';
import logo from '../../assets/prioritrack-logo-with-text.svg';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ChangePass(): JSX.Element {
  const [users, setUsers] = useState([]);
  const { id } = useParams();
  const user_id = parseInt(id, 10);

  const [newPassword, setNewPassword] = useState([]);
  const [confirmNewPassword, setConfirmNewPassword] = useState([]);

  const [isValid, setIsValid] = useState(false);

  // useEffect(() => {
  //   Axios.get(`http://localhost:3001/user/get/${id}`)
  //     .then((res) => {
  //       setUsers(res.data);
  //       console.log(user_id);
  //     })
  //     .catch((err) => console.log(err));
  // }, [id]);

  // useEffect(() => {
  //   if (users.length > 0) {
  //     const user = users[0];
  //     setNewPassword(user.password || '');
  //     //setConfirmNewPassword(user.password || '');
  //   }
  // }, [users]);

  // const updateDb = async (e) => {
  //   e.preventDefault();
  //   if (!password) {
  //     setIsValid(false);
  //     return;
  //   }
  //   setIsValid(true);
  //   await Axios.post(`http://localhost:3001/user/edit/${id}`, {
  //     password,
  //   })
  //     .then(() => {
  //       console.log('Success', password);
  //       navigate('/login', {
  //         state: { successMessage: 'Password Changed' },
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

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
            <form>
              <label htmlFor="newpass" className={styles.label}>
                New Password
              </label>
              <input
                type="password"
                id="newpass"
                name="newpass"
                required
                className={styles.input}
              />

              <label htmlFor="confirmpass" className={styles.label}>
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmpass"
                name="confirmpass"
                required
                className={styles.input}
              />

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
