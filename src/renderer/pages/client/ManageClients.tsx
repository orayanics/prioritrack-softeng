import styles from '../../styles/manage_clients.module.scss';
import React, { useEffect } from 'react';
import Axios from 'axios';
import { Outlet, Link } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';

function ManageClients(): JSX.Element {
  const [users, setUsers] = React.useState([]);

  // FETCH DATA ONCE
  useEffect(() => {
    fetchData();
  }, []);

  // PUT INTO FUNCTION GET USERS
  const fetchData = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/client/list');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // DELETE ONCLICK HANDLER
  const deleteData = async (id) => {
    try {
      const response = await Axios.delete(
        `http://localhost:3001/client/delete/${id}`,
      );
      fetchData();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.column1}>
        <Link to={`/client/add`} className={styles.export}>
          <button className={styles.button}>
            Add a Client <FaPlus />
          </button>{' '}
        </Link>
      </div>
      <div className={styles.column1}>
        <p className={`${styles.title} ${styles.title1}`}>Client Name</p>
        <p className={styles.title}>Property Location</p>
        <p className={`${styles.title} ${styles.cbn}`}>Client Bank Name</p>
        <p className={`${styles.title} ${styles.cba}`}>Client Bank Address</p>
        <p className={`${styles.title} ${styles.tStatus}`}>Status</p>
        <p className={`${styles.title} ${styles.action}`}>Action</p>
      </div>
      {users.map((val, key) => {
        return (
          <>
            <div key={val.client_id} className={styles.card}>
              <div className={styles.column1}>
                <div className={styles['card-capsule']}></div>
                <>
                  <Link className={styles.export} to={`/client/detail/${val.client_id}`}>
                    <div className={styles.column2}>

                      <p className={`${styles.info} ${styles.cName}`}>
                        {val.client_name}
                      </p>

                      <p className={`${styles.info} ${styles.pLoc}`}>
                        {val.client_property_location}
                      </p>

                      <p className={`${styles.info} ${styles.clientBN}`}>
                        {val.client_bank_name}
                      </p>

                      <div className={`${styles.clientBA} ${styles.info}`}>
                        {val.client_bank_address}
                      </div>
                      {/* <p className={`${styles.info} ${styles.dateSub}`}>
                        10/9/2023
                      </p> */}
                      <div className={`${styles.status} ${styles.info}`}>
                        Missed
                      </div>
                    </div>
                  </Link>
                </>
                <div className={`${styles.cursor}`}>
                  <button className={`${styles.edit}`}>
                    <Link
                      to={`/client/edit/${val.client_id}`}
                      className={` ${styles.edit}  `}
                    >
                      <FaEdit className={`${styles.green} `} />
                    </Link>
                  </button>
                </div>
                <div className={`${styles.cursor}`}>
                  <button
                    className={`  ${styles.delete}`}
                    onClick={() => deleteData(val.client_id)}
                  >
                    {/* Delete */}
                    <FaTrashAlt className={`${styles.deletered}`} />
                  </button>
                </div>
                {/* end */}
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}

export default ManageClients;
