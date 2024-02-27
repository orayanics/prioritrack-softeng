import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import styles from '../styles/dashboard.module.scss';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import Modal from 'react-modal';
Modal.setAppElement('#root');
import '../styles/reports.css';
import * as XLSX from 'xlsx';






export default function Home(): JSX.Element {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState<string | null>(null);
  interface Client {
    client_id: string;
    client_name: string;
    client_property_location: string;
    client_bank_name: string;
    client_bank_address: string;

  }

  const [selectedClientName, setSelectedClientName] = useState<string | null>(null);

  const [clientDetails, setClientDetails] = useState<Client | null>(null);



  useEffect(() => {
    fetchData();

  }, []);

  const fetchData = async () => {
    try {

      const response = await Axios.get('http://localhost:3001/dashboard/list');

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
      const headers = ['Client Name', 'Property Location','Document No.', 'Most Recent Document','Date of Submission','Status'];
      const excelData = [headers, ...data];

      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Client Data');

      // Format Excel sheet
      const wscols = [
        { wch: 20 }, // Width of column A (Client Name)
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      worksheet['!cols'] = wscols;

      // Save workbook as Excel file
      XLSX.writeFile(workbook, 'client_data.xlsx');
    } else {
      console.log('No clients available to generate report.');
    }
  };



  return (
    <div className={styles.container}>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3 className={styles.titleDelete}>Are you sure you want to delete this client?</h3>
            <div className={styles.midDelete}>
              <button onClick={handleDeleteConfirmation} className={`${styles.btn} ${styles.cancel}`}>Confirm</button>
              <button onClick={() => setIsModalOpen(false)} className={`${styles.btn} ${styles.submit}`}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.column1}>
      <Link to="/reports">
      <button className={styles.button} onClick={handleGenerateReport}>
  Generate Reports
</button>
</Link>
      </div>

      <div className='row2'>
        <div className='column1'>
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
                <td colSpan={2}>
                  <select name="month" id="month">
                    <option value="january">January</option>
                    <option value="dave">February</option>
                    <option value="pumpernickel">March</option>
                    <option value="reeses">April</option>
                  </select>
                </td>
                <td colSpan={2}>
                  <select name="year" id="year">
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>
                </td>
                <td colSpan={2}>0</td>
                <td colSpan={2}>0</td>
                <td colSpan={2}><div className='pill-report1'></div></td>
                <td colSpan={2}><div className='pill-report2'></div></td>
                <td colSpan={2}><div className='pill-report3'>1</div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <br></br>
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
              <div
                className={`${styles.cardCapsule}  ${styles.statusMissed}`}
              ></div>

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
                    {val.doc_no}
                  </p>
                  <p className={`${styles.info} ${styles.cName}`}>
                    {/* Most Recent Document */}
                    {val.doc_type}
                  </p>
                  <p className={`${styles.info} ${styles.cName}`}>
                    {/*  Date of Submission */}
                    {val.doc_date_submission}
                  </p>

                  <div className={`${styles.status} ${styles.info}`}>
                    {val.doc_status}
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
                {/* <button
                  className={`${styles.delete}`}
                  onClick={() => deleteData(val.client_id)}
                >
                  <FaTrashAlt className={`${styles.deletered}`} />
                </button> */}
                <button
                  className={`${styles.delete}`}
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
