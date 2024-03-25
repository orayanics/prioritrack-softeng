import React, { useEffect, useState, useRef } from 'react';
import Axios from 'axios';
import { Outlet, Link } from 'react-router-dom';

import styles from '../styles/dashboard.module.scss';
import '../styles/global_styles.css';
import { FaTrashAlt, FaPlus, FaEdit, FaUser, FaTable } from 'react-icons/fa';
import { TiExport } from 'react-icons/ti';
import Modal from 'react-modal';
Modal.setAppElement('#root');
import icSortUp from '../assets/icons/ic-sort-up.svg';
import icSortDown from '../assets/icons/ic-sort-down.svg';
import logo from '../assets/prioritrack-logo.svg';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/Search';
import * as XLSX from 'xlsx';

Modal.setAppElement('#root');

interface SortIcons {
  clientName: 'asc' | 'desc';
  propertyLocation: 'asc' | 'desc';
  documentNo: 'asc' | 'desc';
  mostRecentDocument: 'asc' | 'desc';
  dateOfSubmission: 'asc' | 'desc';
  status: 'asc' | 'desc';
}

export default function Home({ setActivePage, setPrevActivePage }) {
  const [users, setUsers] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const location = useLocation(); // Use the useLocation hook
  const [successMessage, setSuccessMessage] = useState('');
  const [iconToShow, setIconToShow] = useState<React.ReactElement | null>(null);
  const [successMessageLogin, setSuccessMessageLogin] = useState('');

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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
  const successAddLogo = (
    <div className={styles.logoSuccess}>
      <FaPlus />
    </div>
  );

  const successLogin = (
    <div className={styles.logoSuccess}>
      <FaUser />
    </div>
  );

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      console.log(
        `Location.state.successMessage: ${location.state.successMessage}`,
      );
      if (location.state.successMessage == 'Client Deleted') {
        setIconToShow(successDeleteLogo);
      }
      setTimeout(() => setSuccessMessage(''), 3000); // Adjust the timeout as needed
    }
    setActivePage('Dashboard');
  }, [location]);
  useEffect(() => {
    if (location.state?.successMessageLogin) {
      setSuccessMessage(location.state.successMessageLogin);
      setIconToShow(successLogin);
      setTimeout(() => setSuccessMessage(''), 3000); // Adjust the timeout as needed
    }
  }, [location]);

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
    getAllData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await Axios.get(`http://localhost:3001/dashboard/list`);
      setUsers(response.data);
      setFilteredUsers(response.data);
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
      const sortedData = response.data;

      // // Sort filteredUsers state
      // const filteredSorted = filteredUsers.sort((a, b) => {
      //   if (sortIcons[activeSortIcon as keyof SortIcons] === 'asc') {
      //     return a[activeSortIcon] > b[activeSortIcon] ? 1 : -1;
      //   } else {
      //     return a[activeSortIcon] < b[activeSortIcon] ? 1 : -1;
      //   }
      // });

      setFilteredUsers(sortedData);
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
      setTimeout(() => setSuccessMessage(''), 3000); // Adjust the timeout as needed (3000)
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
  type StatusType = 'Missed' | 'Ongoing' | 'Complete';

  const getStatusClass = (status: StatusType) => {
    switch (status) {
      case 'Missed':
        return styles.statusMissed;
      case 'Ongoing':
        return styles.statusOngoing;

      case 'Complete':
        return styles.statusComplete;
      default:
        return '';
    }
  };
  const [documents, setDocuments] = useState([
    'BID Letter',
    'Statement of Account',
    'Minutes of Auction sale',
    "Sheriff's fee",
    'Tax Declaration',
    'Real Estate Tax Payment',
    'JDF Payment O.R.',
    'Certificate of Sale',
    'LRA Assessment Form P.O.',
    'LRA O.R.',
    'Annotated Transfer Certificate of Title',
    'Certificate of Posting',
    "Notice of Sheriff's Sale",
    'Tax Clearance',
    'Follow-up letter',
  ]);
  function getDocumentClass(documents) {
    switch (documents) {
      case 'BID Letter':
        return styles.bidletter;
      case 'Statement of Account':
        return styles.statementofaccount;
      case 'Minutes of Auction sale':
        return styles.minutesofauctionsale;
      case "Sheriff's fee":
        return styles.sheriffsfee;
      case 'Tax Declaration':
        return styles.taxdeclaration;
      case 'Real Estate Tax Payment':
        return styles.realestatetaxpayment;
      case 'JDF Payment O.R.':
        return styles.jdfpaymentor;
      case 'Certificate of Sale':
        return styles.certificateofsale;
      case 'LRA Assessment Form P.O.':
      case 'LRA O.R.':
        return styles.lrapo;
      case 'Annotated Transfer Certificate of Title':
        return styles.annotatedtransfercot;
      case 'Certificate of Posting':
        return styles.certofposting;
      case 'Tax Clearance':
        return styles.taxclearance;
      case 'Follow-up letter':
        return styles.followupletter;
      case 'Follow-up letter 1':
        return styles.followupletter;
      case 'Follow-up letter 2':
        return styles.followupletter;
      case 'Follow-up letter 3':
        return styles.followupletter;
      default:
        return '';
    }
  }

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    const filtered = users.filter((user) =>
      user.client_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);

  const getAllData = async () => {
    try {
      const response = await Axios.get(`http://localhost:3001/list`);
      // console.log('Export Data:');
      // console.log(response.data);
      setExportData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const currDay = today.getDate().toString().padStart(2, '0');
    const currMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    const currYear = today.getFullYear().toString().padStart(4, '0');
    return `${currMonth}-${currDay}-${currYear}`;
  };

  // Export Data
  const handleGenerateReport = () => {
    const clients = exportData;
    console.log('Export Data:', clients);
    if (clients && clients.length > 0) {
      // Prepare data for Excel
      const data = [];
      clients.forEach((client) => {
        if (client.documents && client.documents.length > 0) {
          client.documents.forEach((document) => {
            data.push([
              client.client_name,
              client.client_property_location,
              client.client_bank_name,
              client.client_bank_address,
              document.doc_type,
              document.doc_no,
              document.doc_date_submission,
              document.doc_date_turnaround,
              document.doc_status,
            ]);
          });
        } else {
          data.push([
            client.client_name,
            client.client_property_location,
            client.client_bank_name,
            client.client_bank_address,
            '',
            '',
            '',
            '',
            '',
          ]);
        }
      });

      if (data.length > 0) {
        // Add header row
        const headers = [
          'Client Name',
          'Property Location',
          'Bank Name',
          'Bank Address',
          'Document Type',
          'Document Number',
          'Date of Submission',
          'Turnaround Date',
          'Document Status',
        ];
        const excelData = [headers, ...data];
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(excelData);
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          'Clients and Documents Data',
        );
        // Format Excel sheet
        const wscols = [
          { wch: 20 }, // Width of column A (Client Name)
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
        ];
        worksheet['!cols'] = wscols;
        // Save workbook as Excel file
        XLSX.writeFile(
          workbook,
          `Client and Documents Data - ${getTodayDate()}.xlsx`,
        );
      } else {
        console.log('No data available to generate report.');
      }
    } else {
      console.log('No clients found.');
    }
  };

  return (
    <div>
      <div className={styles.bgLogo}>
        <img src={logo} />
      </div>
      <div className={styles.topMargin}></div>
      {successMessage && (
        <div className={styles.containerSuccess}>
          {iconToShow}
          <div className={styles.successMessage}>{successMessage}</div>
        </div>
      )}
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
        <div className={styles.columnButtons}>
          <SearchBar onSearch={handleSearch} />
          <div className={styles.export} onClick={handleGenerateReport}>
            <button className={styles.button}>
              Export Data
              <TiExport className={styles.icExport} />
            </button>
          </div>
          <Link to="/reports" className={styles.export}>
            <button className={styles.button}>
              Reports
              <FaTable className={styles.icTable} />
            </button>
          </Link>
          <div className={styles.col1}>
            <div className={styles.rec}>
              <h2>MRD Legends</h2>
              {documents.map((document, index) => (
                <div
                  key={index}
                  className={`${styles.capsuleLegends} ${getDocumentClass(
                    document,
                  )}`}
                >
                  <div>{document}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.mainLayout}>
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
                src={
                  sortIcons.propertyLocation === 'asc' ? icSortUp : icSortDown
                }
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
                src={
                  sortIcons.mostRecentDocument === 'asc' ? icSortUp : icSortDown
                }
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
            {/* <p className={`${styles.title} ${styles.tAction}`}>Action</p> */}
          </div>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((val) => (
              <div key={val.client_id} className={styles.card}>
                <div className={styles.column1}>
                  <div
                    className={`${styles.cardCapsule} ${
                      val.doc_status == 'Missed'
                        ? styles.statusMissed
                        : val.doc_status == 'Ongoing'
                        ? styles.statusOngoing
                        : val.doc_status == 'Complete'
                        ? styles.statusComplete
                        : ''
                    } `}
                  ></div>

                  <Link
                    className={styles.export}
                    to={`/client/detail/${val.client_id}`}
                    onClick={() => setPrevActivePage('Dashboard')}
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
                      <div className={styles.mrdWidth}>
                        <div
                          className={` ${styles.info}
                          ${styles.mrd} ${styles.cName} ${getDocumentClass(
                            val.doc_type,
                          )}`}
                        >
                          {/* Most Recent Document */}
                          {val.doc_type}
                        </div>
                      </div>
                      <p className={`${styles.info} ${styles.dateSub}`}>
                        {/*  Date of Submission */}
                        {val.doc_date_submission}
                      </p>

                      <div
                        className={`${styles.status} ${
                          val.doc_status == 'Missed'
                            ? styles.statusMissed
                            : val.doc_status == 'Ongoing'
                            ? styles.statusOngoing
                            : val.doc_status == 'Complete'
                            ? styles.statusComplete
                            : ''
                        } `}
                      >
                        {val.doc_status}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.card}>
              <div className={`${styles.column1} ${styles.center}`}>
                <div className={`${styles.column2}`}>
                  There is no client with a document yet.
                </div>
              </div>
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
