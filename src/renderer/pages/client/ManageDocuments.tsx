import React, { useEffect, useState } from 'react';
import '../../styles/global_styles.css';
import Axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { FaTrashAlt, FaEdit, FaPlus } from 'react-icons/fa';
import { TiExport } from 'react-icons/ti';
import styles from '../../styles/manage_docs.module.scss';
import icSortUp from '../../assets/icons/ic-sort-up.svg';
import icSortDown from '../../assets/icons/ic-sort-down.svg';
import logo from '../../assets/prioritrack-logo.svg';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';

interface SortIcons {
  documentType: 'asc' | 'desc';
  dateOfSubmission: 'asc' | 'desc';
  turnaroundDate: 'asc' | 'desc';
  status: 'asc' | 'desc';
}
import { useLocation } from 'react-router-dom';

function ManageDocuments({ setActivePage, activeDoc, setActiveDoc }) {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const [sortIcons, setSortIcons] = useState<SortIcons>({
    documentType: 'asc',
    dateOfSubmission: 'asc',
    turnaroundDate: 'asc',
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
  const location = useLocation(); // Use the useLocation hook
  const [successMessage, setSuccessMessage] = useState('');
  const [iconToShow, setIconToShow] = useState<React.ReactElement | null>(null);
  // MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [DocumentIdToDelete, setDocumentIdToDelete] = useState(null);
  // interface Client {
  //   client_name: string;
  //   client_property_location: string;
  //   client_bank_name: string;
  //   client_bank_address: string;
  // }

  // const [clientDetails, setClientDetails] = useState<Client | null>(null);

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

  useEffect(() => {
    setActivePage('');
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const column = document.getElementById(activeDoc);
      console.log(`Column: ${column} = ${activeDoc}`);
      if (column) {
        column.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Remove the activeDoc class after 3 seconds
    const timeout = setTimeout(() => {
      setActiveDoc('');
    }, 5000);
    return () => clearTimeout(timeout);
  }, [activeDoc]);

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      console.log(
        `Location.state.successMessage: ${location.state.successMessage}`,
      );
      if (location.state.successMessage == 'Document Edited') {
        setIconToShow(successEditLogo);
      } else if (location.state.successMessage == 'Document Added') {
        setIconToShow(successAddLogo);
      }
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

  // const deleteData = async (id) => {
  //   try {
  //     await Axios.delete(`http://localhost:3001/doc/delete/${id}`);
  //     setIconToShow(successDeleteLogo);
  //     setSuccessMessage('Document Deleted');
  //     fetchData();
  //   } catch (error) {
  //     console.error('Error deleting data:', error);
  //   }
  // };
  const deleteData = async (id) => {
    try {
      await Axios.delete(`http://localhost:3001/doc/delete/${id}`);
      fetchData();
      setIconToShow(successDeleteLogo);
      setSuccessMessage('Document Deleted');
      setTimeout(() => setSuccessMessage(''), 3000); // Adjust the timeout as needed
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleDeleteConfirmation = async () => {
    await deleteData(DocumentIdToDelete);
    setIsModalOpen(false);
  };
  const openDeleteModal = async (id) => {
    setDocumentIdToDelete(id);
    try {
      const response = await Axios.get(
        `http://localhost:3001/client/update/${id}`,
      );
      // setClientDetails(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching client details:', error);
    }
  };
  // Export to Excel
  const handleGenerateReport = () => {
    if (
      userData &&
      userData.client_name &&
      userData.client_property_location &&
      userData.client_bank_name &&
      userData.client_bank_address &&
      userData.documents &&
      userData.documents.length > 0
    ) {
      const client = userData;

      // Prepare client data for Excel
      const clientData = [
        ['Client Name', 'Property Location', 'Bank Name', 'Bank Address'],
        [
          client.client_name,
          client.client_property_location,
          client.client_bank_name,
          client.client_bank_address,
        ],
      ];

      // Prepare document data for Excel
      const documentData = [
        [
          'Document Type',
          'Document Number',
          'Date of Submission',
          'Turnaround Date',
          'Document Status',
        ],
      ];
      // Map each document to its corresponding data row
      userData.documents.forEach((document) => {
        documentData.push([
          document.doc_type,
          document.doc_no,
          document.doc_date_submission,
          document.doc_date_turnaround,
          document.doc_status,
        ]);
      });

      const emptyRow = [[]];

      const excelData = [...clientData, emptyRow, ...documentData];

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
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
      ];

      worksheet['!cols'] = wscols;

      // Save workbook as Excel file
      XLSX.writeFile(workbook, `Report for ${clientData[1][0]}.xlsx`);
    } else {
      console.log('Data not available to generate report.');
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

  const getDocumentClass = (documents) => {
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
      {isModalOpen && (
        // {users.map((val) => (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3 className={styles.titleDelete}>
              Are you sure you want to delete this Document?
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

      <div className={styles.container}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className={styles.col1}>
              <Link to={`/client/document/${id}`}>
                <button className={styles.button}>
                  Add a Document <FaPlus />
                </button>
              </Link>
              <button className={styles.button} onClick={handleGenerateReport}>
                Generate Report <TiExport className={styles.icExport} />
              </button>
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
                <p className={`${styles.title} ${styles.title1}`}>
                  Document No.
                </p>
                <p
                  className={`${styles.title} ${styles.dt} sortableColumn`}
                  onClick={() => handleSortIcon('documentType')}
                >
                  Document Type
                  <img
                    src={
                      sortIcons.documentType === 'asc' ? icSortUp : icSortDown
                    }
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
                      sortIcons.dateOfSubmission === 'asc'
                        ? icSortUp
                        : icSortDown
                    }
                    alt="Sort"
                    className={`headerIcon ${
                      activeSortIcon === 'dateOfSubmission' &&
                      'activeHeaderIcon'
                    }`}
                  ></img>
                </p>
                <p
                  className={`${styles.title} ${styles.cbn} sortableColumn`}
                  onClick={() => handleSortIcon('turnaroundDate')}
                >
                  Turnaround Date
                  <img
                    src={
                      sortIcons.turnaroundDate === 'asc' ? icSortUp : icSortDown
                    }
                    alt="Sort"
                    className={`headerIcon ${
                      activeSortIcon === 'turnaroundDate' && 'activeHeaderIcon'
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
                <div
                  className={`${styles.card} ${
                    doc.doc_no === activeDoc && styles.activeDoc
                  }`}
                  key={doc.doc_id}
                  id={doc.doc_no}
                >
                  <div className={styles.row1}>
                    <div
                      className={`${styles.cardCapsule} ${
                        doc.doc_status == 'Missed'
                          ? styles.statusMissed
                          : doc.doc_status == 'Upcoming'
                          ? styles.statusUpcoming
                          : doc.doc_status == 'Ongoing'
                          ? styles.statusOngoing
                          : doc.doc_status == 'Complete'
                          ? styles.statusComplete
                          : doc.doc_status == 'On Hold'
                          ? styles.statusOnHold
                          : ''
                      }`}
                    >
                      {' '}
                    </div>
                    <div className={styles.row2} key={doc.doc_id}>
                      <p className={styles.docNo}>{doc.doc_no}</p>
                      <div className={styles.mrdWidth}>
                        <div
                          className={`${styles.info} ${styles.mrd} ${
                            styles.cName
                          }  ${getDocumentClass(doc.doc_type)}`}
                        >
                          {' '}
                          {doc.doc_type}
                        </div>
                      </div>
                      <p className={styles.dateSub}>
                        {doc.doc_date_submission}
                      </p>
                      <p className={styles.dateSub}>
                        {doc.doc_date_turnaround}
                      </p>
                      <div
                        className={`${styles.status} ${
                          doc.doc_status == 'Missed'
                            ? styles.statusMissed
                            : doc.doc_status == 'Upcoming'
                            ? styles.statusUpcoming
                            : doc.doc_status == 'Ongoing'
                            ? styles.statusOngoing
                            : doc.doc_status == 'Complete'
                            ? styles.statusComplete
                            : doc.doc_status == 'On Hold'
                            ? styles.statusOnHold
                            : ''
                        }`}
                      >
                        {doc.doc_status}
                      </div>
                      <div className={styles.cursor}>
                        <button className={styles.edit}>
                          <Link to={`/document/edit/${doc.doc_id}`}>
                            <FaEdit className={styles.green_icon} />
                          </Link>
                        </button>
                      </div>
                      <div className={styles.cursor}>
                        <button
                          className={styles.delete}
                          // onClick={() => deleteData(doc.doc_id)}
                          onClick={() => {
                            setDocumentIdToDelete(doc.doc_id);
                            setIsModalOpen(true);
                          }}
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
    </div>
  );
}

export default ManageDocuments;
