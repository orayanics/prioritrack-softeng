import React, { useEffect, useState } from 'react';
import '../../styles/global_styles.css';
import Axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaEdit, FaPlus, FaCopy } from 'react-icons/fa';
import { TiExport } from 'react-icons/ti';
import styles from '../../styles/manage_docs.module.scss';
import icSortUp from '../../assets/icons/ic-sort-up.svg';
import icSortDown from '../../assets/icons/ic-sort-down.svg';
import icLinkFolder from '../../assets/icons/ic-link-folder.svg';
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

function ManageDocuments({
  setActivePage,
  activeDoc,
  setActiveDoc,
  setPrevLoc,
  prevActivePage,
  setPrevActivePage,
}) {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [mostRecentDoc, setMostRecentDoc] = useState('');

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

  //Client Modal
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  interface Client {
    client_name: string;
    client_property_location: string;
    client_bank_name: string;
    client_bank_address: string;
    client_docs_link: string;
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
  const successCopyLogo = (
    <div className={styles.logoSuccess}>
      <FaCopy />
    </div>
  );

  useEffect(() => {
    setActivePage('');
    setPrevLoc('');
    getMostRecentDoc();
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
      if (
        location.state.successMessage == 'Document Edited' ||
        location.state.successMessage == 'Client Edited'
      ) {
        setIconToShow(successEditLogo);
      } else if (location.state.successMessage == 'Document Added') {
        setIconToShow(successAddLogo);
      }
      getMostRecentDoc();
      setTimeout(() => setSuccessMessage(''), 3000); // Adjust the timeout as needed
    }
  }, [location]);

  useEffect(() => {
    if (successMessage == 'Copied To Clipboard') {
      setIconToShow(successCopyLogo);
    }
    getMostRecentDoc();
  }, [successMessage]);

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

  const getMostRecentDoc = async () => {
    try {
      const response =
        id != null &&
        (await Axios.get(
          `http://localhost:3001/list/${id}/dateOfSubmission/desc`,
        ));
      console.log('Most Recent Doc Sort: ');
      console.log(response.data);
      if (response.data.documents.length > 0) {
        setMostRecentDoc(response.data.documents[0].doc_type);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
      getMostRecentDoc();
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

  const deleteClientData = async (id) => {
    try {
      await Axios.delete(`http://localhost:3001/client/delete/${id}`);
      fetchData();
      setIconToShow(successDeleteLogo);
      setSuccessMessage('Client Deleted');
      setTimeout(() => setSuccessMessage(''), 3000); // Adjust the timeout as needed
      if (prevActivePage == 'Dashboard') {
        navigate('/', {
          state: { successMessage: 'Client Deleted' },
        });
      } else if (prevActivePage == 'Clients') {
        navigate('/client', {
          state: { successMessage: 'Client Deleted' },
        });
      }
      setPrevActivePage('');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleClientDeleteConfirmation = async () => {
    await deleteClientData(clientIdToDelete);
    setIsModalOpen(false);
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

  const copyToClipboard = (text: string) => {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    tempTextArea.setSelectionRange(0, 99999);
    document.execCommand('copy');
    setSuccessMessage('Copied To Clipboard');
    setTimeout(() => setSuccessMessage(''), 3000);
    document.body.removeChild(tempTextArea);
    console.log('Copied the text: ' + text);
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
              Are you sure you want to delete this document?
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
      {isClientModalOpen && (
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
                onClick={handleClientDeleteConfirmation}
                className={styles.btn + ' ' + styles.cancel}
              >
                Confirm
              </button>
              <button
                onClick={() => setIsClientModalOpen(false)}
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
                {/* {userData.documents.length > 0 ? (
                  <>
                    {userData.documents
                      .map((doc) => ({
                        ...doc,
                        doc_date_submission: new Date(doc.doc_date_submission),
                      }))
                      .sort((a, b) => {
                        if (a.doc_date_submission !== b.doc_date_submission) {
                          return b.doc_date_submission - a.doc_date_submission;
                        } else {
                          return b.doc_id - a.doc_id;
                        }
                      })
                      .slice(0, 1)
                      .map((doc) => (
                        <div key={doc.doc_id}>
                          <h3>{doc.doc_type}</h3>
                        </div>
                      ))}
                  </>
                ) : (
                  <h3>No documents found</h3>
                )} */}
                <h3>{mostRecentDoc != '' ? mostRecentDoc : 'N/A'}</h3>
                <p>Link to Folder</p>
                <div className={`${styles.linkButtons}`}>
                  <div>
                    <a
                      href={userData.client_docs_link}
                      className={
                        userData.client_docs_link == '' ||
                        userData.client_docs_link == null
                          ? styles.disabledLink
                          : ''
                      }
                    >
                      <button
                        className={`${styles.linkFolderButton} ${
                          userData.client_docs_link == '' ||
                          userData.client_docs_link == null
                            ? styles.linkButtonDisabled
                            : ''
                        }`}
                      >
                        <img
                          src={icLinkFolder}
                          alt="Linked Folder"
                          className={`${styles.linkFolderIcon}  ${
                            userData.client_docs_link == '' ||
                            userData.client_docs_link == null
                              ? styles.linkIconDisabled
                              : ''
                          }`}
                        ></img>
                        Open Link
                      </button>
                    </a>
                  </div>
                  <button
                    className={`${styles.copy} ${styles.copyLink} ${
                      userData.client_docs_link == '' ||
                      userData.client_docs_link == null
                        ? `${styles.copyLinkDisabled} ${styles.disabledLink}`
                        : ''
                    }`}
                    onClick={() => {
                      copyToClipboard(`${userData.client_docs_link}`);
                    }}
                  >
                    <FaCopy className={`${styles.copyIcon}`} /> Copy Link
                  </button>
                </div>
              </div>
              <div className={styles.rec2}>
                <div className={`${styles.clientButtons}`}>
                  <button
                    className={`${styles.edit} ${styles.editClient}`}
                    onClick={() => setPrevLoc(`${id}`)}
                  >
                    <Link to={`/client/edit/${userData.client_id}`}>
                      <FaEdit className={`${styles.green_icon}`} /> Edit
                    </Link>
                  </button>
                  <button
                    className={`${styles.delete} ${styles.deleteClient}`}
                    onClick={() => {
                      setClientIdToDelete(userData.client_id);
                      setIsClientModalOpen(true);
                      setPrevLoc(`${id}`);
                    }}
                  >
                    <FaTrashAlt className={`${styles.deletered}`} /> Delete
                  </button>
                </div>
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
              {userData.documents.length > 0 ? (
                userData.documents.map((doc) => (
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
                ))
              ) : (
                <div className={styles.card}>
                  <div className={`${styles.row1} ${styles.center}`}>
                    There are no documents added yet for this client.
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ManageDocuments;
