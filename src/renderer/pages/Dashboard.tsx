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

import React, { useEffect, useState, useRef } from 'react';
import Axios from 'axios';
import { Outlet, Link } from 'react-router-dom';
import styles from '../styles/dashboard.module.scss';
import '../styles/global_styles.css';
import { FaTrashAlt } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import Modal from 'react-modal';
import icSortUp from '../assets/icons/ic-sort-up.svg';
import icSortDown from '../assets/icons/ic-sort-down.svg';

Modal.setAppElement('#root');

interface SortIcons {
  clientName: 'asc' | 'desc';
  propertyLocation: 'asc' | 'desc';
  documentNo: 'asc' | 'desc';
  mostRecentDocument: 'asc' | 'desc';
  dateOfSubmission: 'asc' | 'desc';
  status: 'asc' | 'desc';
}

export default function Home() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  // const [clientDetails, setClientDetails] = useState({});

  const [sortIcons, setSortIcons] = useState<SortIcons>({
    clientName: 'asc',
    propertyLocation: 'asc',
    documentNo: 'asc',
    mostRecentDocument: 'asc',
    dateOfSubmission: 'asc',
    status: 'asc',
  });
  const [activeSortIcon, setActiveSortIcon] = useState('');
  const isInitialSortMount = useRef(true);
  const handleSortIcon = (field: keyof SortIcons) => {
    if (activeSortIcon == field) {
      setSortIcons((prevSortIcons) => ({
        ...prevSortIcons,
        [field]: prevSortIcons[field] === 'asc' ? 'desc' : 'asc',
      }));
    }
    setActiveSortIcon(field);
    console.log(
      activeSortIcon + ' ' + sortIcons[activeSortIcon as keyof SortIcons],
    );
  };
  useEffect(() => {
    //call if sortIcons, activeSortIcon changes
    if (isInitialSortMount.current) {
      isInitialSortMount.current = false;
    } else {
      fetchSortedData();
    }
  }, [sortIcons, activeSortIcon]);

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
      const response = await Axios.get(`http://localhost:3001/dashboard/list`);
      setUsers(response.data);
      console.log(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchSortedData = async () => {
    try {
      const response = await Axios.get(
        `http://localhost:3001/dashboard/list/${activeSortIcon}/${
          sortIcons[activeSortIcon as keyof SortIcons]
        }`,
      );
      setUsers(response.data);
      //console.log(response);
      console.log(
        `http://localhost:3001/dashboard/list/${activeSortIcon}/${
          sortIcons[activeSortIcon as keyof SortIcons]
        }`,
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const deleteData = async (id) => {
    try {
      await Axios.delete(`http://localhost:3001/client/delete/${id}`);
      fetchData();
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

  return (
    <div className={styles.container}>
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
        <Link to={`/AddClient`} className={styles.export}>
          <button className={styles.button}>Export Data</button>
        </Link>
        <Link to="/reports" className={styles.export}>
          <button className={styles.button}>Reports</button>
        </Link>
      </div>
      <div className={styles.column1}>
        <p
          className={`${styles.title} ${styles.title1} sortableColumn`}
          onClick={() => handleSortIcon('clientName')}
        >
          Client Name
          <img
            src={sortIcons.clientName === 'asc' ? icSortUp : icSortDown}
            alt="Sort"
            className={`headerIcon ${
              activeSortIcon === 'clientName' && 'activeHeaderIcon'
            }`}
          ></img>
        </p>
        <p
          className={`${styles.title} ${styles.pl} sortableColumn`}
          onClick={() => handleSortIcon('propertyLocation')}
        >
          Property Location
          <img
            src={sortIcons.propertyLocation === 'asc' ? icSortUp : icSortDown}
            alt="Sort"
            className={`headerIcon ${
              activeSortIcon === 'propertyLocation' && 'activeHeaderIcon'
            }`}
          ></img>
        </p>
        <p className={`${styles.title} ${styles.dn}`}>Document No.</p>
        <p
          className={`${styles.title} ${styles.title_mrd} ${styles.sortableColumn}`}
          onClick={() => handleSortIcon('mostRecentDocument')}
        >
          Most Recent Document
          <img
            src={sortIcons.mostRecentDocument === 'asc' ? icSortUp : icSortDown}
            alt="Sort"
            className={`headerIcon ${
              activeSortIcon === 'mostRecentDocument' && 'activeHeaderIcon'
            }`}
          ></img>
        </p>
        <p
          className={`${styles.title} ${styles.ds} ${styles.sortableColumn}`}
          onClick={() => handleSortIcon('dateOfSubmission')}
        >
          Date of Submission
          <img
            src={sortIcons.dateOfSubmission === 'asc' ? icSortUp : icSortDown}
            alt="Sort"
            className={`headerIcon ${
              activeSortIcon === 'dateOfSubmission' && 'activeHeaderIcon'
            }`}
          ></img>
        </p>
        <p
          className={`${styles.title} ${styles.tStatus} ${styles.sortableColumn}`}
          onClick={() => handleSortIcon('status')}
        >
          Status
          <img
            src={sortIcons.status === 'asc' ? icSortUp : icSortDown}
            alt="Sort"
            className={`headerIcon ${
              activeSortIcon === 'status' && 'activeHeaderIcon'
            }`}
          ></img>
        </p>
        <p className={`${styles.title} ${styles.tAction}`}>Action</p>
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
                  <p className={`${styles.info} ${styles.docNo}`}>
                    {/* document number */}
                    {val.doc_no}
                  </p>
                  <p className={`${styles.info} ${styles.cName}`}>
                    {/* Most Recent Document */}
                    {val.doc_type}
                  </p>
                  <p className={`${styles.info} ${styles.dateSub}`}>
                    {/*  Date of Submission */}
                    {val.doc_date_submission}
                  </p>

                  <div className={`${styles.status}`}>{val.doc_status}</div>
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
    </div>
  );
}
