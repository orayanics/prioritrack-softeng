import React from 'react';
import '../styles/reports.css';

function Reports(): JSX.Element {
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
                <td colSpan={2}><div className='pill-report1'>1</div></td>
                <td colSpan={2}><div className='pill-report2'>1</div></td>
                <td colSpan={2}><div className='pill-report3'>1</div></td>

              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>

        </div>
        <br></br>
        <br></br>
        <table className="table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Property Location</th>
              <th>Document No.</th>
              <th>Most Recent Document</th>
              <th>Date of Submission</th>
              <th>Status</th>
            </tr>
          </thead>
        </table>
        <div className='card-capsule'></div>
        <div className='card'>
          <table className="table2">
            <tbody>
              {/* Sample Row */}
              <tr>
                <td>Jose Reyes</td>
                <td>Property Location</td>
                <td>U052345606-R</td>
                <td><div className='pill2'>Tax Clearance</div></td>
                <td>10/9/2023</td>
                <td><div className='pill'>Missed</div></td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Reports;
