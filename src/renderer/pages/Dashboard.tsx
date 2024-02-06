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

import React, { useEffect } from 'react';
import Axios from 'axios';
import { Outlet, Link } from 'react-router-dom';
import styles from '../styles/dashboard.module.scss';

export default function Home() {
  const [users, setUsers] = React.useState([]);

  // FETCH DATA ONCE
  useEffect(() => {
    fetchData();
  }, []);

  // PUT INTO FUNCTION GET USERS
  const fetchData = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/list');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // DELETE ONCLICK HANDLER
  const deleteData = async (id) => {
    try {
      const response = await Axios.delete(
        `http://localhost:3001/list/delete/${id}`,
      );
      fetchData();
    } catch (error) {
      console.error('Error fetching data:', error);
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
        <button className={styles.button}>Reports</button>
      </div>
      <div className={styles.column1}>
        <p className={`${styles.title} ${styles.title1}`}>Client Name</p>
        <p className={styles.title}>Property Location</p>
        <p className={styles.title}>Document No.</p>
        <p className={styles.title}>Most Recent Document</p>
        <p className={styles.title}>Date of Submission</p>
        <p className={`${styles.title} ${styles.tStatus}`}>Status</p>
        <p className={`${styles.title} ${styles.tStatus}`}>Action</p>
      </div>
      {users.map((val) => {
        return (
          // <div key={val.idusers}>
          //   <p>{val.idusers}</p>
          //   <p>{val.name}</p>
          //   <p>{val.phone}</p>
          //   <button>
          //     <Link to={`/list/${val.idusers}`}>Read</Link>
          //   </button>
          //   <button>
          //     <Link to={`/list/edit/${val.idusers}`}>Update</Link>
          //   </button>
          //   <button onClick={() => deleteData(val.idusers)}>Delete</button>
          // </div>

          <>
            {/* // <div key={val.idusers}>
            //   <p>{val.idusers}</p>
            //   <p>{val.name}</p>
            //   <p>{val.phone}</p>
            //   <button>
            //     <Link to={`/list/${val.idusers}`}>Read</Link>
            //   </button>
            //   <button>
            //     <Link to={`/list/edit/${val.idusers}`}>Update</Link>
            //   </button>
            //   <button onClick={() => deleteData(val.idusers)}>Delete</button>
            // </div> */}
            <Link className={styles.export} to={`/list/${val.idusers}`}>
              <div key={val.idusers} className={styles.card}>
                <div className={styles.column1}>
                  <div className={styles['card-capsule']}></div>
                  <div className={styles.column2}>
                    <p className={`${styles.info} ${styles.cName}`}>
                      {val.name}
                    </p>
                    <p className={`${styles.info} ${styles.pLoc}`}>
                      Property Location
                    </p>
                    <p className={`${styles.info} ${styles.docNo}`}>
                      U052345606-R
                    </p>
                    <div className={`${styles.mrd} ${styles.info}`}>
                      Tax Clearance
                    </div>
                    <p className={`${styles.info} ${styles.dateSub}`}>
                      10/9/2023
                    </p>
                    <div className={`${styles.status} ${styles.info}`}>
                      Missed
                    </div>
                    <div>
                      <button
                        className={`${styles.status} ${styles.info}  ${styles.delete}`}
                        onClick={() => deleteData(val.idusers)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </>
        );
      })}
    </div>
  );
}
