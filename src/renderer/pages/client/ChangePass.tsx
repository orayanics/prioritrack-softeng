import React from 'react';
import styles from '../../styles/change_pass.module.scss';

function ChangePass(): JSX.Element {
  return (
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
              Confirm Password
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
                  Verify
                </button>
                <button
                  type="submit"
                  className={`${styles.button} ${styles.cancelButton}`}
                >
                  Cancel
                </button>
              </center>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePass;
