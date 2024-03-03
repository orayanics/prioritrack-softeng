import React from 'react';
import Axios from 'axios';
import styles from '../../styles/forgot_pass.module.scss';
import logo from '../../assets/prioritrack-logo-with-text.svg';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ForgotPass(): JSX.Element {
  const navigate = useNavigate();
  const [username, setUsername] = useState('egoreta');
  const [id, setID] = useState(null);

  const [birthday, setBirthday] = useState('');
  const [dog, setDog] = useState('');
  const [mother, setMother] = useState('');

  useEffect(() => {
    Axios.get(`http://localhost:3001/user/get/${username}`)
      .then((res) => {
        setID(res.data);
        if (res.data.length > 0) {
          setID(res.data[0].user_id);
          console.log(id);
        } else {
          console.log('User not found');
        }
      })
      .catch((err) => console.log(err));
  }, [username]);

  const [error, setError] = useState('');

  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();

  //   const formData = new FormData(event.currentTarget as HTMLFormElement);
  //   console.log(`FormData: ${formData}`);
  //   for (const [key, value] of formData.entries()) {
  //     console.log(`${key}: ${value}`);
  //   }

  //   try {
  //     const response = await Axios.post(
  //       'http://localhost:3001/forgotpass',
  //       formData,
  //       {
  //         // headers: {
  //         //   'Content-Type': 'multipart/form-data',
  //         // },
  //       },
  //     );

  //     console.log('Response:', response); // Log the response object

  //     const data = await response.data;
  //     setVerificationResult(data);
  //   } catch (error) {
  //     console.error('Error:', error.response.data);
  //   }
  // };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Get form values
    const formData = {
      birthday: birthday,
      dog: dog,
      mother: mother,
    };

    try {
      const response = await Axios.post(
        'http://localhost:3001/forgotpass',
        formData,
      );

      console.log('Response:', response.data);
      if (response.data == 'Correct') {
        setError('');
        navigate(`/changepass/${id}`);
      } else if (response.data == 'Incorrect') {
        setError('You have one or more incorrect answers');
      }
    } catch (error) {
      console.error('Error:', error.response.data);
      setError('An error occured, please try again');
    }
  };

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
            <form onSubmit={handleSubmit}>
              <label htmlFor="birthday" className={`${styles.label}`}>
                1. When is your birthday?
              </label>
              <input
                type="text"
                id="birthday"
                name="birthday"
                onChange={(e) => setBirthday(e.target.value)}
                required
                className={`${styles.input}`}
              />

              <label htmlFor="dog" className={styles.label}>
                2. What is the name of your dog?
              </label>
              <input
                type="text"
                id="dog"
                name="dog"
                onChange={(e) => setDog(e.target.value)}
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
                onChange={(e) => setMother(e.target.value)}
                required
                className={styles.input}
              />

              {error && <p className={styles.error}>{error}</p>}

              <div className={`${styles.buttonContainer}`}>
                <center>
                  <button type="submit" className={`${styles.verifyButton}`}>
                    {/* <Link
                      to={`/changepass/${id}`}
                      className={styles.cancel_text}
                    >
                      Verify
                    </Link> */}
                    Verify
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
