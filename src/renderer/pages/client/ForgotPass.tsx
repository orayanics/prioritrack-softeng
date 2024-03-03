import React from 'react';
import styles from '../../styles/forgot_pass.module.scss';
import logo from '../../assets/prioritrack-logo-with-text.svg';
import { Link } from 'react-router-dom';

function ForgotPass(): JSX.Element {
  return (
    <div className={styles.bg}>
      <div className={styles.bgImage}></div>
      <div className={styles.logo}>
        <img src={logo} />
      </div>
      <div className={`${styles.container}`}>
        <div className={`${styles.cardContainer}`}>
          <div className={`${styles.card}`}>
            <center>
              <h2 className={`${styles.title}`}>Verification Questions</h2>
            </center>
            <form>
              <label htmlFor="1" className={`${styles.label}`}>
                1. When is your birthday?
              </label>
              <input
                type="text"
                id=""
                name=""
                required
                className={`${styles.input}`}
              />

              <label htmlFor="q2" className={`${styles.label}`}>
                2. What is the name of your dog?
              </label>
              <input
                type="text"
                id=""
                name=""
                required
                className={`${styles.input}`}
              />

              <label htmlFor="q3" className={`${styles.label}`}>
                3. What is your mother's maiden name?
              </label>
              <input
                type="text"
                id=""
                name=""
                required
                className={`${styles.input}`}
              />

              <div className={`${styles.buttonContainer}`}>
                <center>
                  <button type="button" className={`${styles.verifyButton}`}>
                    <Link to={`/changepass`} className={styles.cancel_text}>
                      Verify
                    </Link>
                  </button>
                  <button type="button" className={`${styles.cancelButton}`}>
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

export default ForgotPass;
