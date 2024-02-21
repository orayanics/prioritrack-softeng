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
import { FaTrashAlt } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';

export default function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/client/list');
      setUsers(response.data);
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
  return (
    <div className={styles.container}>
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
              <div className={styles['card-capsule']}></div>
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
                    Document No.
                  </p>
                  <p className={`${styles.info} ${styles.cName}`}>
                    {/* Most Recent Document */}
                    Most Recent Document
                  </p>
                  <p className={`${styles.info} ${styles.cName}`}>
                    {/*  Date of Submission */}
                    Date of Submission
                  </p>

                  <div className={`${styles.status} ${styles.info}`}>
                    Missed
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
                <button
                  className={`${styles.delete}`}
                  onClick={() => deleteData(val.client_id)}
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
