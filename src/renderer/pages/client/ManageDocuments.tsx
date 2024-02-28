import React, { useEffect, useState } from 'react';
import '../../styles/global_styles.css';
import Axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { FaTrashAlt, FaEdit, FaPlus } from 'react-icons/fa';
import styles from '../../styles/manage_docs.module.scss';
import icSortUp from '../../assets/icons/ic-sort-up.svg';
import icSortDown from '../../assets/icons/ic-sort-down.svg';

interface SortIcons {
  documentType: 'asc' | 'desc';
  dateOfSubmission: 'asc' | 'desc';
  status: 'asc' | 'desc';
}
import { useLocation } from 'react-router-dom';

function ManageDocuments() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const [sortIcons, setSortIcons] = useState<SortIcons>({
    documentType: 'asc',
    dateOfSubmission: 'asc',
    status: 'asc',
  });
  const [activeSortIcon, setActiveSortIcon] = useState('');
  const [isSortClicked, setIsSortClicked] = useState(false);
  const handleSortIcon = (field: keyof SortIcons) => {
    if (activeSortIcon == field) {
      setSortIcons((prevSortIcons) => ({
        ...prevSortIcons,
        [field]: prevSortIcons[field] === 'asc' ? 'desc' : 'asc',
      }));
    }
    setActiveSortIcon(field);
    setIsSortClicked(true);
    console.log(
      activeSortIcon + ' ' + sortIcons[activeSortIcon as keyof SortIcons],
    );
  };
  // useEffect(() => {
  //   //call if sortIcons, activeSortIcon changes
  //   fetchSortedData();
  // }, [id, sortIcons, activeSortIcon]);
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

  useEffect(() => {
    fetchData();
  }, [id, sortIcons, activeSortIcon]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response =
        id != null && isSortClicked == false
          ? await Axios.get(`http://localhost:3001/list/${id}`)
          : await Axios.get(
              `http://localhost:3001/list/${id}/${activeSortIcon}/${
                sortIcons[activeSortIcon as keyof SortIcons]
              }`,
            );
      console.log(
        `http://localhost:3001/list/${id}/${activeSortIcon}/${
          sortIcons[activeSortIcon as keyof SortIcons]
        }`,
      );
      console.log(response.data);
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
      setSuccessMessage('Document Deleted');
      setTimeout(() => setSuccessMessage(''), 3000); // Adjust the timeout as needed

      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
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

              {userData.documents.length >= 0 ? (
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
              <p
                className={`${styles.title} ${styles.dt} sortableColumn`}
                onClick={() => handleSortIcon('documentType')}
              >
                Document Type
                <img
                  src={sortIcons.documentType === 'asc' ? icSortUp : icSortDown}
                  alt="Sort"
                  className={`headerIcon ${
                    activeSortIcon === 'documentType' && 'activeHeaderIcon'
                  }`}
                ></img>
              </p>
              <p
                className={`${styles.title} ${styles.cbn} sortableColumn`}
                onClick={() => handleSortIcon('dateOfSubmission')}
              >
                Date of Submission
                <img
                  src={
                    sortIcons.dateOfSubmission === 'asc' ? icSortUp : icSortDown
                  }
                  alt="Sort"
                  className={`headerIcon ${
                    activeSortIcon === 'dateOfSubmission' && 'activeHeaderIcon'
                  }`}
                ></img>
              </p>
              <p
                className={`${styles.title} ${styles.tStatus} sortableColumn`}
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
              <p className={`${styles.title} ${styles.action}`}>Action</p>
            </div>
            {userData.documents.map((doc) => (
              <div className={styles.card}>
                <div className={styles.row1}>
                  <div className={styles.cardCapsule}></div>
                  <div className={styles.row2} key={doc.doc_id}>
                    <p className={styles.docNo}>{doc.doc_no}</p>
                    <div className={styles.mrdWidth}>
                      <div className={styles.mrd}>{doc.doc_type}</div>
                    </div>
                    <p className={styles.dateSub}>{doc.doc_date_submission}</p>
                    <div
                      className={`${styles.status} ${
                        doc.doc_status == 'Missed'
                          ? styles.red
                          : doc.doc_status == 'Upcoming'
                          ? styles.blue
                          : doc.doc_status == 'Ongoing'
                          ? styles.yellow
                          : doc.doc_status == 'Complete'
                          ? styles.green
                          : doc.doc_status == 'On Hold'
                          ? styles.orange
                          : ''
                      }`}
                    >
                      {doc.doc_status}
                    </div>
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
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ManageDocuments;
