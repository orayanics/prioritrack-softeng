import { useState, FormEvent } from 'react';
import Axios from 'axios';
import Navbar from '../../components/Navbar';
import styles from '../../styles/add_client.module.scss';
import { Outlet, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/prioritrack-logo.svg';

export default function UserAdd() {
  Axios.defaults.baseURL = 'http://localhost:3001';
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [property_location, setPropertyLocation] = useState<string>('');
  const [client_bank_name, setClientBankName] = useState<string>('');
  const [client_bank_address, setClientBankAddress] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);

  const postDb = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !property_location ||
      !client_bank_name ||
      !client_bank_address
    ) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
    await Axios.post('http://localhost:3001/client/add_submit', {
      name,
      property_location,
      client_bank_name,
      client_bank_address,
    })
      .then(() => {
        console.log(
          'THIS IS FRONTEND AXIOS ' + name,
          property_location,
          client_bank_name,
          client_bank_address,
        );
        console.log('Success');
        // navigate('/client');
        navigate('/client', {
          state: { successMessage: 'Client added successfully' },
        });
      })
      .catch((err) => {
        console.log(
          'THIS IS FRONTEND AXIOS ERR ' + name,
          property_location,
          client_bank_name,
          client_bank_address,
        );
        console.log(err);
      });
  };
  console.log(styles);
  return (
    <div className={styles.containermain}>
      <div className={styles.bgLogo}>
        <img src={logo} />
      </div>
      <div className={styles.container}>
        {!isValid && (
          <div className={styles.alert}>
            <span className={styles.closebtn} onClick={() => setIsValid(true)}>
              &times;
            </span>
            <p>Please fill out all fields.</p>
          </div>
        )}
        <div className={styles.card}>
          <h1 className={styles.title}>Add a Client</h1>
          <div className={styles.App}>
            <form onSubmit={postDb}>
              <h3 className={styles.inputTitle}>Client Name</h3>
              <input
                className={styles.input}
                type="text"
                onChange={(e) => setName(e.target.value)}
              />
              <h3 className={styles.inputTitle}>Property Location</h3>
              <input
                className={styles.input}
                type="text"
                onChange={(e) => setPropertyLocation(e.target.value)}
              />
              <h3 className={styles.inputTitle}>Client Bank Name</h3>
              <input
                className={styles.input}
                type="text"
                onChange={(e) => setClientBankName(e.target.value)}
              />
              <h3 className={styles.inputTitle}>Client Bank Address</h3>
              <input
                className={styles.input}
                name="query"
                type="text"
                onChange={(e) => setClientBankAddress(e.target.value)}
              />
              <div className={styles.btn2}>
                <button
                  type="submit"
                  className={styles.btn + ' ' + styles.submit}
                  disabled={!isValid}
                >
                  Submit
                </button>
                <button className={styles.btn + ' ' + styles.cancel}>
                  <Link className={styles.cancel_text} to={`/client`}>
                    Cancel
                  </Link>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
