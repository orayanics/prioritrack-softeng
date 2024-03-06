import styles from '../../styles/manage_clients.module.scss';
import '../../styles/global_styles.css';
import React, { useEffect, useState, useRef } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaEdit, FaPlus } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import icSortUp from '../../assets/icons/ic-sort-up.svg';
import icSortDown from '../../assets/icons/ic-sort-down.svg';
import logo from '../../assets/prioritrack-logo.svg';

interface SortIcons {
  clientName: 'asc' | 'desc';
  propertyLocation: 'asc' | 'desc';
  clientBankName: 'asc' | 'desc';
  clientBankAddress: 'asc' | 'desc';
}

export default function ManageClients() {
  const [users, setUsers] = useState([]);
  const location = useLocation(); // Use the useLocation hook
  const [successMessage, setSuccessMessage] = useState(''); // State for the success message

  const [sortIcons, setSortIcons] = useState<SortIcons>({
    clientName: 'asc',
    propertyLocation: 'asc',
    clientBankName: 'asc',
    clientBankAddress: 'asc',
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

  // Effect to check for a success message in the location state
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Optionally, clear the message after displaying it
      setTimeout(() => setSuccessMessage(''), 3000); // Adjust the timeout as needed
    }
  }, [location]);

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

  const fetchSortedData = async () => {
    try {
      const response = await Axios.get(
        `http://localhost:3001/client/list/${activeSortIcon}/${
          sortIcons[activeSortIcon as keyof SortIcons]
        }`,
      );
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
    <div>
      <div className={styles.bgLogo}>
        <img src={logo} />
      </div>
      <div className={styles.container}>
        {/* Display the success message if it exists */}
        {successMessage && (
          <div className={styles.containerSuccess}>
            <div className={styles.logoSuccess}>
              <FaPlus />
            </div>{' '}
            <div className={styles.successMessage}>Client Added</div>
          </div>
        )}
        <div className={styles.column1}>
          <Link to="/client/add" className={styles.export}>
            <button className={styles.button}>
              Add a Client <FaPlus />
            </button>
          </Link>
        </div>
        <div className={`${styles.column1} ${styles.columnHeader}`}>
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
            className={`${styles.title} sortableColumn`}
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
          <p
            className={`${styles.title} ${styles.cbn} sortableColumn`}
            onClick={() => handleSortIcon('clientBankName')}
          >
            Client Bank Name
            <img
              src={sortIcons.clientBankName === 'asc' ? icSortUp : icSortDown}
              alt="Sort"
              className={`headerIcon ${
                activeSortIcon === 'clientBankName' && 'activeHeaderIcon'
              }`}
            ></img>
          </p>
          <p
            className={`${styles.title} ${styles.cba} sortableColumn`}
            onClick={() => handleSortIcon('clientBankAddress')}
          >
            Client Bank Address
            <img
              src={
                sortIcons.clientBankAddress === 'asc' ? icSortUp : icSortDown
              }
              alt="Sort"
              className={`headerIcon ${
                activeSortIcon === 'clientBankAddress' && 'activeHeaderIcon'
              }`}
            ></img>
          </p>
          {/* <p className={`${styles.title} ${styles.tStatus} sortableColumn`}>
          Status
        </p> */}
          <p className={`${styles.title} ${styles.action}`}>Action</p>
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
                    <p className={`${styles.info} ${styles.clientBN}`}>
                      {val.client_bank_name}
                    </p>
                    <div className={`${styles.clientBA} ${styles.info}`}>
                      {val.client_bank_address}
                    </div>
                    {/* <div className={`${styles.status} ${styles.info}`}>
                    Missed
                  </div> */}
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
                <div className={`${styles.clientBA} ${styles.info}`}>
                  No data
                </div>
                <div className={`${styles.status} ${styles.info}`}>No data</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
