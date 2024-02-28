import React, { useState } from 'react';
import styles from '../../styles/forgot_pass.module.scss';

function ForgotPass(): JSX.Element {
  const [verificationResult, setVerificationResult] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const formDataJson = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('http://localhost:3001/forgotpass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataJson),
      });

      const data = await response.text();
      setVerificationResult(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <body>
      <div className={`${styles.container}`}>
        <div className={`${styles.cardContainer}`}>
          <div className={`${styles.card}`}>
            <center>
              <h2 className={`${styles.title}`}>Verification Questions</h2>
            </center>
            <form onSubmit={handleSubmit}>
              <label htmlFor="birthday" className={`${styles.label}`}>
                1. When is your birthday?
              </label>
              <input
                type="text"
                id="birthday"
                name="birthday"
                required
                className={`${styles.input}`}
              />

              <label htmlFor="dog" className={`${styles.label}`}>
                2. What is the name of your dog?
              </label>
              <input
                type="text"
                id="dog"
                name="dog"
                required
                className={`${styles.input}`}
              />

              <label htmlFor="mother" className={`${styles.label}`}>
                3. What is your mother's maiden name?
              </label>
              <input
                type="text"
                id="mother"
                name="mother"
                required
                className={`${styles.input}`}
              />

              <div className={`${styles.buttonContainer}`}>
                <center>
                  <button type="submit" className={`${styles.verifyButton}`}>
                    Verify
                  </button>
                  <button type="button" className={`${styles.cancelButton}`}>
                    Cancel
                  </button>
                </center>
              </div>
            </form>
            {verificationResult && (
              <p className={`${styles.verificationResult}`}>
                Verification Result: {verificationResult}
              </p>
            )}
          </div>
        </div>
      </div>
    </body>
  );
}

export default ForgotPass;
