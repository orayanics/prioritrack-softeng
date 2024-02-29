import React, { useState } from 'react';
import styles from '../../styles/forgot_pass.module.scss';
import axios from 'axios';

function ForgotPass(): JSX.Element {
  const [verificationResult, setVerificationResult] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    try {
      const response = await axios.post(
        'http://localhost:3001/forgotpass',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('Response:', response); // Log the response object

      const data = await response.data;
      setVerificationResult(data);
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <center>
            <h2 className={styles.title}>Verification Questions</h2>
          </center>
          <form onSubmit={handleSubmit}>
            <label htmlFor="birthday" className={styles.label}>
              1. When is your birthday?
            </label>
            <input
              type="text"
              id="birthday"
              name="birthday"
              required
              className={styles.input}
            />

            <label htmlFor="dog" className={styles.label}>
              2. What is the name of your dog?
            </label>
            <input
              type="text"
              id="dog"
              name="dog"
              required
              className={styles.input}
            />

            <label htmlFor="mother" className={styles.label}>
              3. What is your mother's maiden name?
            </label>
            <input
              type="text"
              id="mother"
              name="mother"
              required
              className={styles.input}
            />

            <div className={styles.buttonContainer}>
              <center>
                <button type="submit" className={styles.verifyButton}>
                  Verify
                </button>
                <button type="button" className={styles.cancelButton}>
                  Cancel
                </button>
              </center>
            </div>
          </form>
          {verificationResult && (
            <p className={styles.verificationResult}>
              Verification Result: {verificationResult}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPass;
