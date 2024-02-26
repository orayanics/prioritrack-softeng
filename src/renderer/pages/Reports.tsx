import React, { useEffect, useState, useRef } from 'react';
import Axios from 'axios';
import '../styles/reports.css';
import '../styles/global_styles.css';
import icSortUp from '../assets/icons/ic-sort-up.svg';
import icSortDown from '../assets/icons/ic-sort-down.svg';

interface SortIcons {
  clientName: 'asc' | 'desc';
  propertyLocation: 'asc' | 'desc';
  documentNo: 'asc' | 'desc';
  mostRecentDocument: 'asc' | 'desc';
  dateOfSubmission: 'asc' | 'desc';
  status: 'asc' | 'desc';
}

function Reports(): JSX.Element {
  const [users, setUsers] = useState([]);

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
  }, []);

  var month = '02';
  var year = '2024';
  const yearMonth = `${year}-${month.padStart(2, '0')}`;

  const fetchData = async () => {
    try {
      const response = await Axios.get(
        `http://localhost:3001/dashboard/${month}/${year}`,
      );
      console.log(`http://localhost:3001/reports/${month}/${year}`);
      setUsers(response.data);
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
      //console.log(response);
      console.log(
        `http://localhost:3001/dashboard/list/${activeSortIcon}/${
          sortIcons[activeSortIcon as keyof SortIcons]
        }`,
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="container">
      {/* Table */}
      <div className="row">
        <div className="column1">
          {/* Use Link for Reports button */}
          <button className="button2">Generate Reports</button>
        </div>
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
                  <select name="month" id="month">
                    <option value="january">January</option>
                    <option value="dave">Febuary</option>
                    <option value="pumpernickel">March</option>
                    <option value="reeses">April</option>
                  </select>
                </td>
                {/* Year dropdown */}
                <td colSpan={2}>
                  <select name="year" id="year">
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>
                </td>
                {/* Other data cells */}
                <td colSpan={2}>0</td>
                <td colSpan={2}>0</td>
                <td colSpan={2}>
                  <div className="pill-report1">1</div>
                </td>
                <td colSpan={2}>
                  <div className="pill-report2">1</div>
                </td>
                <td colSpan={2}>
                  <div className="pill-report3">1</div>
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
        <br></br>
        <br></br>
        <table className="table">
          <thead>
            <tr className="column1">
              <th
                className="title sortableColumn"
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
              <th>Document No.</th>
              <th
                className="title docNo sortableColumn"
                onClick={() => handleSortIcon('mostRecentDocument')}
              >
                Most Recent Document
                <img
                  src={
                    sortIcons.mostRecentDocument === 'asc'
                      ? icSortUp
                      : icSortDown
                  }
                  alt="Sort"
                  className={`headerIcon ${
                    activeSortIcon === 'mostRecentDocument' &&
                    'activeHeaderIcon'
                  }`}
                ></img>
              </th>
              <th
                className="title sortableColumn"
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
                      <td>{val.client_name}</td>
                      <td>{val.client_property_location}</td>
                      <td>{val.doc_no}</td>
                      <td>
                        <div className="pill2">{val.doc_type}</div>
                      </td>
                      <td>{val.doc_date_submission}</td>
                      <td>
                        <div className="pill">{val.doc_status}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <div>
            <div className="card-capsule"></div>
            <div className="card">
              <table className="table2">
                <tbody>
                  <tr>
                    <td>No Data</td>
                    <td>No Data</td>
                    <td>No Data</td>
                    <td>
                      <div className="pill2">No Data</div>
                    </td>
                    <td>No Data</td>
                    <td>
                      <div className="pill">No Data</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
