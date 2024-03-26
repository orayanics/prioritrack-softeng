import { useState, FormEvent } from 'react';
import Axios from 'axios';
import Navbar from '../../components/Navbar';
import styles from '../../styles/add_client.module.scss';
import { Outlet, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/prioritrack-logo.svg';

export default function UserAdd({ setActiveClient }) {
  Axios.defaults.baseURL = 'http://localhost:3001';
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [property_location, setPropertyLocation] = useState<string>('');
  const [client_bank_name, setClientBankName] = useState<string>('');
  const [client_bank_address, setClientBankAddress] = useState<string>('');
  const [client_docs_link, setClientDocsLink] = useState<string>('');
  const [errMessage, setErrMessage] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);

  const postDb = async (e) => {
    e.preventDefault();
    const isValidLink = (url) => {
      // Regular expression to match the pattern https?://*
      const pattern = /^(https?):\/\/.*$/;
      return pattern.test(url);
    };

    if (
      !name ||
      !property_location ||
      !client_bank_name ||
      !client_bank_address
    ) {
      setIsValid(false);
      setErrMessage('Please fill out all fields.');
      return;
    }
    if (client_docs_link && !isValidLink(client_docs_link)) {
      setIsValid(false);
      setErrMessage('Invalid Link.');
      return;
    }
    setIsValid(true);
    setErrMessage('');
    setActiveClient(name);
    await Axios.post('http://localhost:3001/client/add_submit', {
      name,
      property_location,
      client_bank_name,
      client_bank_address,
      client_docs_link,
    })
      .then(() => {
        console.log(
          'THIS IS FRONTEND AXIOS ' + name,
          property_location,
          client_bank_name,
          client_bank_address,
          client_docs_link,
        );
        console.log('Success');
        // navigate('/client');
        navigate('/client', {
          state: { successMessage: 'Client Added' },
        });
      })
      .catch((err) => {
        console.log(
          'THIS IS FRONTEND AXIOS ERR ' + name,
          property_location,
          client_bank_name,
          client_bank_address,
          client_docs_link,
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
            <p>{errMessage}</p>
          </div>
        )}
        <div className={styles.card}>
          <h1 className={styles.title}>Add a Client</h1>
          <div className={styles.App}>
            <form onSubmit={postDb}>
              <h3 className={styles.inputTitle}>Client Name</h3>
              <input
                className={styles.input}
                style={{ outline: 'none' }}
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                  setIsValid(true);
                }}
              />
              <h3 className={styles.inputTitle}>Property Location</h3>
              <input
                className={styles.input}
                style={{ outline: 'none' }}
                type="text"
                onChange={(e) => {
                  setPropertyLocation(e.target.value);
                  setIsValid(true);
                }}
              />
              <h3 className={styles.inputTitle}>Client Bank Name</h3>
              <input
                className={styles.input}
                style={{ outline: 'none' }}
                type="text"
                onChange={(e) => {
                  setClientBankName(e.target.value);
                  setIsValid(true);
                }}
              />
              <h3 className={styles.inputTitle}>Client Bank Address</h3>
              <input
                className={styles.input}
                style={{ outline: 'none' }}
                name="query"
                type="text"
                onChange={(e) => {
                  setClientBankAddress(e.target.value);
                  setIsValid(true);
                }}
              />
              <h3 className={styles.inputTitle}>Link to Documents</h3>
              <input
                className={styles.input}
                style={{ outline: 'none' }}
                name="query"
                type="text"
                onChange={(e) => {
                  setClientDocsLink(e.target.value);
                  setIsValid(true);
                }}
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
