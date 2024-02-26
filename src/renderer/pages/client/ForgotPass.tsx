import React from 'react';
import styles from '../../styles/forgot_pass.module.scss';

function ForgotPass(): JSX.Element {
  return (
    <body>
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
                  <button type="submit" className={`${styles.verifyButton}`}>
                    Verify
                  </button>
                  <button type="submit" className={`${styles.cancelButton}`}>
                    Cancel
                  </button>
                </center>
              </div>
            </form>
          </div>
        </div>
      </div>
    </body>
  );
}

export default ForgotPass;
