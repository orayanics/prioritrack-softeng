import React from 'react';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from '../../styles/add_client.module.scss';
import { useNavigate } from 'react-router-dom';

export default function Update() {
  const [users, setUsers] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get(`http://localhost:3001/list/${id}`)
      .then((res) => {
        setUsers([res.data]); // Assuming the response is an object representing a single user
      })
      .catch((err) => console.log(err));
  }, [id]);

  const [name, setName] = useState('');
  const [client_property_location, setPropertyLocation] = useState('');
  const [client_bank_name, setClientBankName] = useState('');
  const [client_bank_address, setClientBankAddress] = useState('');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (users.length > 0) {
      const user = users[0];
      setName(user.name || '');
      setPropertyLocation(user.client_property_location || '');
      setClientBankName(user.client_bank_name || '');
      setClientBankAddress(user.client_bank_address || '');
    }
  }, [users]);

  const updateDb = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !client_property_location ||
      !client_bank_name ||
      !client_bank_address
    ) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
    await Axios.post(`http://localhost:3001/list/edit/${id}`, {
      name,
      client_property_location,
      client_bank_name,
      client_bank_address,
    })
      .then(() => {
        console.log(
          'Success',
          name,
          client_property_location,
          client_bank_name,
          client_bank_address,
        );
        navigate('/home');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.container}>
      {users.map((val) => (
        <div className={styles.card} key={val.idusers}>
          <p>{val.idusers}</p>
          <p>{val.name}</p>
          <p>{val.phone}</p>
          <h1 className={styles.title}>Edit a Client</h1>
          <form onSubmit={updateDb}>
            <h3 className={styles.inputTitle}>Client Name</h3>
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <h3 className={styles.inputTitle}>Property Location</h3>
            <input
              className={styles.input}
              type="text"
              value={client_property_location}
              onChange={(e) => setPropertyLocation(e.target.value)}
            />
            <h3 className={styles.inputTitle}>Client Bank Name</h3>
            <input
              className={styles.input}
              type="text"
              value={client_bank_name}
              onChange={(e) => setClientBankName(e.target.value)}
            />
            <h3 className={styles.inputTitle}>Client Bank Address</h3>
            <input
              className={styles.input}
              type="text"
              value={client_bank_address}
              onChange={(e) => setClientBankAddress(e.target.value)}
            />
            <div className={styles.btn2}>
              <button
                type="submit"
                className={styles.btn + ' ' + styles.submit}
                // disabled={!isValid}
              >
                Submit
              </button>
              <button className={styles.btn + ' ' + styles.cancel}>
                <Link className={styles.cancel_text} to={`/home`}>
                  Cancel
                </Link>
              </button>
            </div>
          </form>
        </div>
      ))}
    </div>
  );
}
