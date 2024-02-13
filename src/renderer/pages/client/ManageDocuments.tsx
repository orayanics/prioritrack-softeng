import styles from '../../styles/manage_docs.module.scss';
import React, { useEffect } from 'react';
import Axios from 'axios';
import { Outlet, Link } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';

function ManageDocuments(): JSX.Element {
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
    <div>
      <div className={styles.container}>
        <div className={styles.col1}>
          <button className={styles.button}>Add a Document</button>
          <div className={styles.rec}>
            <p>Client Name</p>
            <h3>Juan Dela Cruz</h3>
            <p>Property Location</p>
            <h3>Property Name</h3>
            <p>Client Bank Name</p>
            <h3>BDO</h3>
            <p>Client Bank Address</p>
            <h3>Bank Address</h3>
            <p>Most Recent Document</p>
            <h3>Minutes of Auction Sale</h3>
          </div>
        </div>
        <div className={styles.col2}>
          <div className={styles.row1}>
            <p className={`${styles.title} ${styles.title1}`}>Document No.</p>
            <p className={styles.title}>Document Type</p>
            <p className={`${styles.title} ${styles.cbn}`}>
              Date of Submission
            </p>
            <p className={`${styles.title} ${styles.tStatus}`}>Status</p>
            <p className={`${styles.title} ${styles.action}`}>Action</p>
          </div>

          <div className={styles.card}>
            <div className={styles.row1}>
              <div className={styles.cardCapsule}></div>
              <div className={styles.row2}>
                <p className={styles.docNo}>U052269606-R</p>
                <div className={styles.mrd}>Tax Clearance</div>
                <p className={styles.dateSub}>11/19/2023</p>
                <div className={styles.status}>Missed</div>

                <div className={`${styles.cursor}`}>
                  <button className={`${styles.edit}`}>
                    <Link
                      // to={`/list/edit/${val.idusers}`}
                      className={` ${styles.edit}  `}
                    >
                      <FaEdit className={`${styles.green} `} />
                    </Link>
                  </button>
                </div>
                <div className={`${styles.cursor}`}>
                  <button
                    className={`  ${styles.delete}`}
                    // onClick={() => deleteData(val.idusers)}
                  >
                    {/* Delete */}
                    <FaTrashAlt className={`${styles.deletered}`} />
                  </button>
                </div>
                {/* end */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageDocuments;
