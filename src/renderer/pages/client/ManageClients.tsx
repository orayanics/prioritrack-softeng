import styles from '../../styles/manage_clients.module.scss';
import '../../styles/global_styles.css';
import React, { useEffect, useState, useRef } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaEdit, FaPlus } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import icSortUp from '../../assets/icons/ic-sort-up.svg';
import icSortDown from '../../assets/icons/ic-sort-down.svg';
import icLinkFolder from '../../assets/icons/ic-link-folder.svg';
import logo from '../../assets/prioritrack-logo.svg';
import Modal from 'react-modal';

interface SortIcons {
  clientName: 'asc' | 'desc';
  propertyLocation: 'asc' | 'desc';
  clientBankName: 'asc' | 'desc';
  clientBankAddress: 'asc' | 'desc';
}

export default function ManageClients({
  activeClient,
  setActiveClient,
  setPrevActivePage,
}) {
  const [users, setUsers] = useState([]);
  const location = useLocation(); // Use the useLocation hook
  const [successMessage, setSuccessMessage] = useState(''); // State for the success message
  //Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);

  const [iconToShow, setIconToShow] = useState<React.ReactElement | null>(null);
  interface Client {
    client_name: string;
    client_property_location: string;
    client_bank_name: string;
    client_bank_address: string;
  }
  const [clientDetails, setClientDetails] = useState<Client | null>(null);

  const successDeleteLogo = (
    <div className={styles.logoSuccess}>
      <FaTrashAlt />
    </div>
  );
  const successAddLogo = (
    <div className={styles.logoSuccess}>
      <FaPlus />
    </div>
  );
  const successEditLogo = (
    <div className={styles.logoSuccess}>
      <FaEdit />
    </div>
  );
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      const column = document.getElementById(activeClient);
      console.log(`Column: ${column} = ${activeClient}`);
      if (column) {
        column.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Remove the activeDoc class after 3 seconds
    const timeout = setTimeout(() => {
      setActiveClient('');
    }, 5000);
    return () => clearTimeout(timeout);
  }, [activeClient]);

  // Effect to check for a success message in the location state
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      console.log(
        `Location.state.successMessage: ${location.state.successMessage}`,
      );
      if (location.state.successMessage == 'Client Edited') {
        setIconToShow(successEditLogo);
      } else if (location.state.successMessage == 'Client Added') {
        setIconToShow(successAddLogo);
      } else if (location.state.successMessage == 'Client Deleted') {
        setIconToShow(successDeleteLogo);
      }
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
      console.log(response.data);
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

  return (
    <div>
      <div className={styles.bgLogo}>
        <img src={logo} />
      </div>
      <div className={styles.container}>
        {/* Display the success message if it exists */}
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
          <p className={`${styles.title} ${styles.linkFolder}`}>
            Link to Folder
          </p>
          <p className={`${styles.title} ${styles.action}`}>Action</p>
        </div>
        {users.length > 0 ? (
          users.map((val) => (
            <div
              key={val.client_id}
              className={`${styles.card} ${
                val.client_name === activeClient && styles.activeClient
              }`}
              id={val.client_name}
            >
              <div className={styles.column1}>
                <div className={styles['card-capsule']}></div>
                <Link
                  className={styles.export}
                  to={`/client/detail/${val.client_id}`}
                  onClick={() => setPrevActivePage('Clients')}
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
                  <a href={val.client_docs_link}>
                    <button
                      className={`${styles.linkFolderButton} ${
                        val.client_docs_link == '' ||
                        val.client_docs_link == null
                          ? styles.linkButtonDisabled
                          : ''
                      }`}
                    >
                      <img
                        src={icLinkFolder}
                        alt="Linked Folder"
                        className={`${styles.linkFolderIcon}  ${
                          val.client_docs_link == '' ||
                          val.client_docs_link == null
                            ? styles.linkIconDisabled
                            : ''
                        }`}
                      ></img>
                    </button>
                  </a>
                </div>
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
                    // onClick={() => deleteData(val.client_id)
                    // }
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
            <div className={`${styles.column1} ${styles.center}`}>
              <div className={styles.column2}>There is no client yet.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
