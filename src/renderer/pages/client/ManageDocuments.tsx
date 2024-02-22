import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { FaTrashAlt, FaEdit, FaPlus } from 'react-icons/fa';
import styles from '../../styles/manage_docs.module.scss';

function ManageDocuments() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(`http://localhost:3001/list/${id}`);
      setUserData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const deleteData = async (id) => {
    try {
      await Axios.delete(`http://localhost:3001/doc/delete/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className={styles.col1}>
            <Link to={`/client/document/${id}`}>
              <button className={styles.button}>Add a Document</button>
            </Link>
            <div className={styles.rec}>
              <p>Client Name</p>
              <h3>{userData.client_name}</h3>
              <p>Property Location</p>
              <h3>{userData.client_property_location}</h3>
              <p>Client Bank Name</p>
              <h3>{userData.client_bank_name}</h3>
              <p>Client Bank Address</p>
              <h3>{userData.client_bank_address}</h3>
              <p>Most Recent Document</p>

              {userData.documents.length > 0 ? (
                <>
                  {userData.documents
                    .map((doc) => ({
                      ...doc,
                      doc_date_submission: new Date(doc.doc_date_submission),
                    }))
                    .sort(
                      (a, b) => b.doc_date_submission - a.doc_date_submission,
                    )
                    .slice(0, 1)
                    .map((doc) => (
                      <div key={doc.doc_id}>
                        <h3>{doc.doc_type}</h3>
                      </div>
                    ))}
                </>
              ) : (
                <p>No documents found</p>
              )}
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
                {userData.documents.map((doc) => (
                  <div className={styles.row2} key={doc.doc_id}>
                    <p className={styles.docNo}>{doc.doc_no}</p>
                    <div className={styles.mrd}>{doc.doc_type}</div>
                    <p className={styles.dateSub}>{doc.doc_date_submission}</p>
                    <div className={styles.status}>{doc.doc_status}</div>
                    <div className={styles.cursor}>
                      <button className={styles.edit}>
                        <Link to={`/document/edit/${doc.doc_id}`}>
                          <FaEdit className={styles.green} />
                        </Link>
                      </button>
                    </div>
                    <div className={styles.cursor}>
                      <button
                        className={styles.delete}
                        onClick={() => deleteData(doc.doc_id)}
                      >
                        <FaTrashAlt className={styles.deletered} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ManageDocuments;
