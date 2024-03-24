import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from '../../styles/add_client.module.scss';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/prioritrack-logo.svg';

export default function Update({ setActiveClient }) {
  const [users, setUsers] = useState([]);
  const { id } = useParams();
  const client_id = parseInt(id, 10);
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get(`http://localhost:3001/client/update/${id}`)
      .then((res) => {
        setUsers(res.data);
        console.log(client_id);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const [client_name, setName] = useState('');
  const [client_property_location, setPropertyLocation] = useState('');
  const [client_bank_name, setClientBankName] = useState('');
  const [client_bank_address, setClientBankAddress] = useState('');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (users.length > 0) {
      const user = users[0];
      setName(user.client_name || '');
      setPropertyLocation(user.client_property_location || '');
      setClientBankName(user.client_bank_name || '');
      setClientBankAddress(user.client_bank_address || '');
    }
  }, [users]);

  const updateDb = async (e) => {
    e.preventDefault();
    if (
      !client_name ||
      !client_property_location ||
      !client_bank_name ||
      !client_bank_address
    ) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
    setActiveClient(client_name);
    await Axios.post(`http://localhost:3001/list/edit/${id}`, {
      client_name,
      client_property_location,
      client_bank_name,
      client_bank_address,
      client_id,
    })
      .then(() => {
        console.log(
          'Success',
          client_name,
          client_property_location,
          client_bank_name,
          client_bank_address,
        );
        navigate('/client', {
          state: { successMessage: 'Client Edited' },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.bgLogo}>
        <img src={logo} />
      </div>
      {!isValid && (
        <div className={styles.alert}>
          <span className={styles.closebtn} onClick={() => setIsValid(true)}>
            &times;
          </span>
          <p>Please fill out all fields.</p>
        </div>
      )}
      {users.map((val) => (
        <div className={styles.card} key={val.client_id}>
          <h1 className={styles.title}>Edit a Client</h1>
          <form onSubmit={updateDb}>
            <h3 className={styles.inputTitle}>Client Name</h3>
            <input
              className={styles.input}
              type="text"
              value={client_name}
              onChange={(e) => {
                setName(e.target.value);
                setIsValid(true);
              }}
            />
            <h3 className={styles.inputTitle}>Property Location</h3>
            <input
              className={styles.input}
              type="text"
              value={client_property_location}
              onChange={(e) => {
                setPropertyLocation(e.target.value);
                setIsValid(true);
              }}
            />
            <h3 className={styles.inputTitle}>Client Bank Name</h3>
            <input
              className={styles.input}
              type="text"
              value={client_bank_name}
              onChange={(e) => {
                setClientBankName(e.target.value);
                setIsValid(true);
              }}
            />
            <h3 className={styles.inputTitle}>Client Bank Address</h3>
            <input
              className={styles.input}
              type="text"
              value={client_bank_address}
              onChange={(e) => {
                setClientBankAddress(e.target.value);
                setIsValid(true);
              }}
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
                <Link className={styles.cancel_text} to={`/client`}>
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
