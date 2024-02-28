// const { connectDb } = require('../database/conn.tsx');

// export default function Home() {

//   const getProducts = async () => {
//     const conn = await connectDb();
//     const results = await conn.query('SELECT * FROM users');
//     return results;
//   };

//   return (
//     <div>Home</div>
//   )
// }

import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Outlet, Link } from 'react-router-dom';

import styles from '../styles/dashboard.module.scss';
import { FaTrashAlt, FaPlus, FaEdit } from 'react-icons/fa';
import Modal from 'react-modal';
Modal.setAppElement('#root');
import { useLocation } from 'react-router-dom';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const location = useLocation(); // Use the useLocation hook
  const [successMessage, setSuccessMessage] = useState('');
  const [iconToShow, setIconToShow] = useState<React.ReactElement | null>(null);

  const successDeleteLogo = (
    <div className={styles.logoSuccess}>
      <FaTrashAlt />
    </div>
  );

  const successEditLogo = (
    <div className={styles.logoSuccess}>
      <FaEdit />
    </div>
  );

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      setIconToShow(successEditLogo);
      setTimeout(() => setSuccessMessage(''), 3000); // Adjust the timeout as needed
    }
  }, [location]);

  // const [clientDetails, setClientDetails] = useState({});
  interface Client {
    client_name: string;
    client_property_location: string;
    client_bank_name: string;
    client_bank_address: string;
  }

  const [clientDetails, setClientDetails] = useState<Client | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/dashboard/list');
      setUsers(response.data);
      console.log(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const deleteData = async (id) => {
    try {
      await Axios.delete(`http://localhost:3001/client/delete/${id}`);
      fetchData();
      setIconToShow(successDeleteLogo);
      setSuccessMessage('Client Deleted');
      setTimeout(() => setSuccessMessage(''), 3000); // Adjust the timeout as needed
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleDeleteConfirmation = async () => {
    await deleteData(clientIdToDelete);
    setIsModalOpen(false);
  };
  const openDeleteModal = async (id) => {
    setClientIdToDelete(id);
    try {
      const response = await Axios.get(
        `http://localhost:3001/client/update/${id}`,
      );
      setClientDetails(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching client details:', error);
    }
  };
  type StatusType = 'Missed' | 'Ongoing' | 'Upcoming' | 'Complete' | 'OnHold';

  const getStatusClass = (status: StatusType) => {
    switch (status) {
      case 'Missed':
        return styles.statusMissed;
      case 'Ongoing':
        return styles.statusOngoing;
      case 'Upcoming':
        return styles.statusUpcoming;
      case 'Complete':
        return styles.statusComplete;
      case 'OnHold':
        return styles.statusOnHold;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      {successMessage && (
        <div className={styles.containerSuccess}>
          {iconToShow}

          <div className={styles.successMessage}>{successMessage}</div>
        </div>
      )}

      {isModalOpen && (
        // {users.map((val) => (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3 className={styles.titleDelete}>
              Are you sure you want to delete this client?
            </h3>
            {/* <p>Client Name: {clientDetails.client_name}</p>
            <p>Property Location: {clientDetails.client_property_location}</p>
            <p>Bank Name: {clientDetails.client_bank_name}</p>
            <p>Bank Address: {clientDetails.client_bank_address}</p> */}
            <div className={styles.midDelete}>
              <button
                onClick={handleDeleteConfirmation}
                className={styles.btn + ' ' + styles.cancel}
              >
                Confirm
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className={styles.btn + ' ' + styles.submit}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.column1}>
        <button className={styles.button}>
          <Link to={`/AddClient`} className={styles.export}>
            Export Data
          </Link>
        </button>
        <Link to="/reports">
          <button className={styles.button}>Reports</button>
        </Link>
      </div>
      <div className={styles.column1}>
        <p className={`${styles.title} ${styles.title1}`}>Client Name</p>
        <p className={`${styles.title} ${styles.pl}`}>Property Location</p>
        <p className={`${styles.title} ${styles.dn}`}>Document No.</p>
        <p className={`${styles.title} ${styles.title_mrd}`}>
          Most Recent Document
        </p>
        <p className={`${styles.title} ${styles.ds}`}>Date of Submission</p>
        <p className={`${styles.title} ${styles.tStatus}`}>Status</p>
        <p className={`${styles.title} ${styles.tStatus}`}>Action</p>
      </div>
      {users.length > 0 ? (
        users.map((val) => (
          <div key={val.client_id} className={styles.card}>
            <div className={styles.column1}>
              <div
                className={`${styles.cardCapsule}  ${styles.statusMissed}`}
              ></div>

              <Link
                className={styles.export}
                to={`/client/detail/${val.client_id}`}
              >
                <div className={styles.column2}>
                  <p className={`${styles.info} ${styles.cName}`}>
                    {val.client_name}
                  </p>
                  <p className={`${styles.info} ${styles.pLoc}`}>
                    {val.client_property_location}
                  </p>
                  <p className={`${styles.info} ${styles.pLoc}`}>
                    {/* document number */}
                    {val.doc_no}
                  </p>
                  <p className={`${styles.info} ${styles.cName}`}>
                    {/* Most Recent Document */}
                    {val.doc_type}
                  </p>
                  <p className={`${styles.info} ${styles.cName}`}>
                    {/*  Date of Submission */}
                    {val.doc_date_submission}
                  </p>

                  <div
                    className={`${styles.status} ${
                      styles.info
                    } ${getStatusClass(val.doc_status)}`}
                  >
                    {val.doc_status}
                  </div>
                </div>
              </Link>
              <div className={`${styles.cursor}`}>
                <button className={`${styles.edit}`}>
                  <Link
                    to={`/client/edit/${val.client_id}`}
                    className={styles.edit}
                  >
                    <FaEdit className={`${styles.green}`} />
                  </Link>
                </button>
              </div>
              <div className={`${styles.cursor}`}>
                {/* <button
                  className={`${styles.delete}`}
                  onClick={() => deleteData(val.client_id)}
                >
                  <FaTrashAlt className={`${styles.deletered}`} />
                </button> */}
                <button
                  className={`${styles.delete}`}
                  onClick={() => {
                    setClientIdToDelete(val.client_id);
                    setIsModalOpen(true);
                  }}
                >
                  <FaTrashAlt className={`${styles.deletered}`} />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.card}>
          <div className={styles.column1}>
            <div className={styles['card-capsule']}></div>
            <div className={styles.column2}>
              <p className={`${styles.info} ${styles.cName}`}>No data</p>
              <p className={`${styles.info} ${styles.pLoc}`}>No data</p>
              <p className={`${styles.info} ${styles.clientBN}`}>No data</p>
              <div className={`${styles.clientBA} ${styles.info}`}>No data</div>
              <div className={`${styles.status} ${styles.info}`}>No data</div>
            </div>
          </div>
        </div>
      )}
      <Outlet />
    </div>
  );
}
