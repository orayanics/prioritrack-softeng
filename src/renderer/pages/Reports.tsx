import React, { useEffect, useState, useRef } from 'react';
import Axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import styles from '../styles/dashboard.module.scss';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import Modal from 'react-modal';
Modal.setAppElement('#root');
import * as XLSX from 'xlsx';
import '../styles/reports.css';
import '../styles/global_styles.css';
import icSortUp from '../assets/icons/ic-sort-up.svg';
import icSortDown from '../assets/icons/ic-sort-down.svg';
import logo from '../assets/prioritrack-logo.svg';

interface SortIcons {
  clientName: 'asc' | 'desc';
  propertyLocation: 'asc' | 'desc';
  documentNo: 'asc' | 'desc';
  mostRecentDocument: 'asc' | 'desc';
  dateOfSubmission: 'asc' | 'desc';
  status: 'asc' | 'desc';
}

export default function Reports(): JSX.Element {
  const [users, setUsers] = useState([]);
  const [sortIcons, setSortIcons] = useState<SortIcons>({
    clientName: 'asc',
    propertyLocation: 'asc',
    documentNo: 'asc',
    mostRecentDocument: 'asc',
    dateOfSubmission: 'asc',
    status: 'asc',
  });

  // SORT
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState<string | null>(null);

  interface Client {
    client_id: string;
    client_name: string;
    client_property_location: string;
    client_bank_name: string;
    client_bank_address: string;
  }

  const [selectedClientName, setSelectedClientName] = useState<string | null>(
    null,
  );

  const [clientDetails, setClientDetails] = useState<Client | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  //current month and year (initial)
  const today = new Date();
  const currMonth = (today.getMonth() + 1).toString().padStart(2, '0');
  const currYear = today.getFullYear().toString().padStart(4, '0');

  // const fetchData = async () => {
  //   try {
  //     const response = await Axios.get('http://localhost:3001/dashboard/list');

  //     setUsers(response.data);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  const fetchData = async () => {
    try {
      const response = await Axios.get(
        `http://localhost:3001/reports/${currMonth}/${currYear}`,
      );
      console.log(
        `Fetched Initial link: http://localhost:3001/reports/${currMonth}/${currYear}`,
      );
      setUsers(response.data);
      console.log(response);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setUsers([]);
        console.log('No data found for the selected month and year');
      } else {
        console.error('Error fetching data:', error);
      }
    }
  };

  const [month, setMonth] = useState(currMonth);
  const [year, setYear] = useState(currYear);

  const months = [
    { name: 'January', number: '01' },
    { name: 'February', number: '02' },
    { name: 'March', number: '03' },
    { name: 'April', number: '04' },
    { name: 'May', number: '05' },
    { name: 'June', number: '06' },
    { name: 'July', number: '07' },
    { name: 'August', number: '08' },
    { name: 'September', number: '09' },
    { name: 'October', number: '10' },
    { name: 'November', number: '11' },
    { name: 'December', number: '12' },
  ];
  const years = []; //change year to when Anrylle is established
  for (let year = 2000; year <= Number(currYear); year++) {
    years.push(year);
  }

  const getMonthName = (monthNum: String) => {
    const monthObj = months.find((month) => month.number === monthNum);
    return monthObj ? monthObj.name : '';
  };

  useEffect(() => {
    //call if month, year changes
    fetchSelectedData();
  }, [month, year]);

  const fetchSelectedData = async () => {
    try {
      const response = await Axios.get(
        `http://localhost:3001/reports/${month}/${year}`,
      );
      setUsers(response.data);
      //console.log(response);
      console.log(
        `Fetched Selected link: http://localhost:3001/reports/${month}/${year}`,
      );
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setUsers([]);
        console.log('No data found for the selected month and year');
      } else {
        console.error('Error fetching data:', error);
      }
    }
  };

  const fetchSortedData = async () => {
    try {
      const response = await Axios.get(
        `http://localhost:3001/reports/${month}/${year}/${activeSortIcon}/${
          sortIcons[activeSortIcon as keyof SortIcons]
        }`,
      );
      setUsers(response.data);
      //console.log(response);
      console.log(
        `Fetched Sorted link: http://localhost:3001/reports/${month}/${year}/${activeSortIcon}/${
          sortIcons[activeSortIcon as keyof SortIcons]
        }`,
      );
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setUsers([]);
        console.log('No data found for the selected month and year');
      } else {
        console.error('Error fetching data:', error);
      }
    }
  };

  const [missed, setMissed] = useState(0);
  const [upcoming, setUpcoming] = useState(0);
  const [ongoing, setOngoing] = useState(0);
  const [complete, setComplete] = useState(0);
  const [onHold, setOnHold] = useState(0);

  useEffect(() => {
    let missedCount = 0;
    let upcomingCount = 0;
    let ongoingCount = 0;
    let completeCount = 0;
    let onHoldCount = 0;

    users.forEach((val: any) => {
      switch (val.doc_status) {
        case 'Missed':
          missedCount++;
          break;
        case 'Upcoming':
          upcomingCount++;
          break;
        case 'Ongoing':
          ongoingCount++;
          break;
        case 'Complete':
          completeCount++;
          break;
        case 'On Hold':
          onHoldCount++;
          break;
        default:
          break;
      }
    });
    setMissed(missedCount);
    setUpcoming(upcomingCount);
    setOngoing(ongoingCount);
    setComplete(completeCount);
    setOnHold(onHoldCount);
  }, [users]);

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

  const handleGenerateReport = () => {
    if (users.length > 0) {
      // Prepare data for Excel
      const data = users.map((client: Client) => [
        client.client_name,
        client.client_property_location,
        client.doc_no, // Include document number
        client.doc_type, // Include document type
        client.doc_date_submission, // Include document date of submission
        client.doc_status, // Include status
      ]);

      // Add header row
      const headers = [
        'Client Name',
        'Property Location',
        'Document No.',
        'Most Recent Document',
        'Date of Submission',
        'Status',
      ];
      const excelData = [headers, ...data];

      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Client Data');

      // Format Excel sheet
      const wscols = [
        { wch: 20 }, // Width of column A (Client Name)
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
      ];

      worksheet['!cols'] = wscols;

      // Save workbook as Excel file
      var order = '';
      if (sortIcons.hasOwnProperty(activeSortIcon)) {
        if (sortIcons[activeSortIcon] === 'asc') {
          order = 'ascending';
        } else {
          order = 'descending';
        }
      }
      var sortColumnName = '';
      if (activeSortIcon == 'clientName') {
        sortColumnName = 'client name';
      } else if (activeSortIcon == 'propertyLocation') {
        sortColumnName = 'property location';
      } else if (activeSortIcon == 'documentNo') {
        sortColumnName = 'document no.';
      } else if (activeSortIcon == 'mostRecentDocument') {
        sortColumnName = 'most recent document';
      } else if (activeSortIcon == 'dateOfSubmission') {
        sortColumnName = 'date of submission';
      } else if (activeSortIcon == 'status') {
        sortColumnName = 'status';
      }
      console.log(
        `order: ${sortIcons[activeSortIcon]} column: ${activeSortIcon}`,
      );
      console.log(`order: ${order} column: ${sortColumnName}`);
      var filename = '';
      if (order == '' || sortColumnName == '') {
        filename = `Report for ${getMonthName(month)} ${year}`;
      } else {
        filename = `Report for ${getMonthName(
          month,
        )} ${year} (${`sorted by ${sortColumnName} in ${order} order`})`;
      }
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    } else {
      console.log('No clients available to generate report.');
    }
  };

  return (
    <div className={styles.container}>
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3 className={styles.titleDelete}>
              Are you sure you want to delete this client?
            </h3>
            <div className={styles.midDelete}>
              <button
                onClick={handleDeleteConfirmation}
                className={`${styles.btn} ${styles.cancel}`}
              >
                Confirm
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`${styles.btn} ${styles.submit}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.column1}>
        <Link to="/reports" className={styles.export}>
          <button className={'button'} onClick={handleGenerateReport}>
            Generate Reports
          </button>
        </Link>
      </div>

      <div className="row2">
        <div className="column1">
          <table className="tablerow1">
            <thead>
              <tr>
                <th colSpan={2}>Month:</th>
                <th colSpan={2}>Year:</th>
                <th colSpan={2}>Missed</th>
                <th colSpan={2}>Upcoming</th>
                <th colSpan={2}>Ongoing</th>
                <th colSpan={2}>Complete</th>
                <th colSpan={2}>On Hold</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* Month dropdown */}
                <td colSpan={2}>
                  <select
                    name="month"
                    id="month"
                    className="dropdown"
                    defaultValue={currMonth}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    {months.map((month) => (
                      <option key={month.number} value={month.number}>
                        {month.name}
                      </option>
                    ))}
                  </select>
                </td>
                {/* Year dropdown */}
                <td colSpan={2}>
                  <select
                    name="year"
                    id="year"
                    className="dropdown"
                    defaultValue={currYear}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </td>
                {/* Other data cells */}
                <td colSpan={2}>
                  <div className="pill-report red">{missed}</div>
                </td>
                <td colSpan={2}>
                  <div className="pill-report blue">{upcoming}</div>
                </td>
                <td colSpan={2}>
                  <div className="pill-report yellow">{ongoing}</div>
                </td>
                <td colSpan={2}>
                  <div className="pill-report green">{complete}</div>
                </td>
                <td colSpan={2}>
                  <div className="pill-report orange">{onHold}</div>
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
      <br></br>
      <table className="table">
        <thead>
          <tr className="column1">
            <th
              className="title cName sortableColumn"
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
            </th>
            <th
              className="title pLoc sortableColumn"
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
            </th>
            <th className="docNo">Document No.</th>
            <th
              className="title mostRecentDoc sortableColumn"
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
            </th>
            <th
              className="title dateOfSub sortableColumn"
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
            </th>
            <th
              className="title stat sortableColumn"
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
            </th>
          </tr>
        </thead>
      </table>

      {users.length > 0 ? (
        users.map((val: any) => (
          <div key={val.client_id}>
            <div className="card-capsule"></div>
            <div className="card">
              <table className="table2">
                <tbody>
                  <tr>
                    <td className="client-name align-left">
                      {val.client_name}
                    </td>
                    <td className="align-left pLoc-row">
                      {val.client_property_location}
                    </td>
                    <td className="align-left docNo-row">{val.doc_no}</td>
                    <td>
                      <div className="pill2">{val.doc_type}</div>
                    </td>
                    <td className="date">{val.doc_date_submission}</td>
                    <td className="status-align">
                      <div
                        className={`pill ${
                          val.doc_status == 'Missed'
                            ? 'red'
                            : val.doc_status == 'Upcoming'
                            ? 'blue'
                            : val.doc_status == 'Ongoing'
                            ? 'yellow'
                            : val.doc_status == 'Complete'
                            ? 'green'
                            : val.doc_status == 'On Hold'
                            ? 'orange'
                            : ''
                        }`}
                      >
                        {val.doc_status}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <div>
          <div className="card noDataCard">
            <table className="table2">
              <thead>
                <tr>
                  <td>{`There is no data for ${getMonthName(
                    month,
                  )} ${year}.`}</td>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
