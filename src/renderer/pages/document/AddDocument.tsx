import { useState, FormEvent, useEffect } from 'react';
import Axios from 'axios';
import Navbar from '../../components/Navbar';
import styles from '../../styles/add_client.module.scss';
import { Outlet, Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import { cli } from 'webpack';
import logo from '../../assets/prioritrack-logo.svg';

export default function AddDocument({ setActiveDoc }) {
  const navigate = useNavigate();

  const [doc_status, setStatus] = useState<string>('');
  const [doc_no, setNumber] = useState<string>('');
  const [doc_date_submission, setDate] = useState<string>('');
  const [doc_type, setType] = useState<string>('');
  const [doc_date_turnaround, setTurnAroundDate] = useState<string>('');

  const [isValid, setIsValid] = useState<boolean>(true);
  const { id } = useParams();
  const client_id = parseInt(id, 10);
  console.log('ID User:', client_id);

  const postDb = async (e) => {
    e.preventDefault();
    if (!doc_status || !doc_no || !doc_date_submission || !doc_type) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
    setActiveDoc(doc_no);
    await Axios.post('http://localhost:3001/client/document/add/:id', {
      client_id,
      doc_status,
      doc_no,
      doc_date_submission,
      doc_date_turnaround,
      doc_type,
    })
      .then(() => {
        console.log(
          'THIS IS FRONTEND AXIOS ' + client_id,
          doc_status,
          doc_no,
          doc_date_submission,
          doc_date_turnaround,
          doc_type,
        );
        console.log('Success');
        navigate(`/client/detail/${client_id}`, {
          state: { successMessage: 'Document Added' },
        });
      })
      .catch((err) => {
        console.log(
          'AXIOS ERR ' + client_id,
          doc_status,
          doc_no,
          doc_date_submission,
          doc_date_turnaround,
          doc_type,
        );
        console.log(err);
      });
  };
  console.log(styles);
  return (
    <div className={styles.containermain}>
      <div className={styles.bgLogo}>
        <img src={logo} />
      </div>
      <div className={styles.container}>
        {!isValid && (
          <div className={styles.alert}>
            <span className={styles.closebtn} onClick={() => setIsValid(true)}>
              &times;
            </span>
            <p>Please fill out all fields.</p>
          </div>
        )}
        <div className={styles.card}>
          <h1 className={styles.title}>Add a Document</h1>
          <div className={styles.App}>
            <form onSubmit={postDb}>
              <h3 className={styles.inputTitle}>Document Number</h3>
              <input
                className={`${styles.input} ${styles.inputDate}`}
                style={{ outline: 'none' }}
                type="text"
                onChange={(e) => {
                  setNumber(e.target.value);
                  setIsValid(true);
                }}
              />
              <h3 className={styles.inputTitle}>Date of Submission</h3>
              <input
                className={`${styles.input} ${styles.inputDate}`}
                style={{ outline: 'none' }}
                type="date"
                onChange={(e) => {
                  setDate(e.target.value);
                  setIsValid(true);
                }}
              />
              <h3 className={styles.inputTitle}>Turnaround Date of Document</h3>
              <input
                className={`${styles.input} ${styles.inputDate}`}
                style={{ outline: 'none' }}
                type="date"
                onChange={(e) => {
                  setTurnAroundDate(e.target.value);
                  setIsValid(true);
                }}
              />
              <h3 className={styles.inputTitle}>Document Type</h3>
              {/* <input
                className={styles.input}
                type="text"
                onChange={(e) => setType(e.target.value)}
              /> */}
              <div className={styles.selectContainer}>
                <select
                  id="status"
                  name="status"
                  className={`${styles.input} ${styles.selectBox}`}
                  style={{ outline: 'none' }}
                  onChange={(e) => {
                    setType(e.target.value);
                    setIsValid(true);
                  }}
                >
                  <option value="">Select a Type of Document</option>
                  <option value="BID Letter">BID Letter</option>
                  <option value="Statement of Account">
                    Statement of Account{' '}
                  </option>
                  <option value="Minutes of Auction sale">
                    Minutes of Auction sale
                  </option>
                  <option value="Sheriff's fee">Sheriff's fee</option>
                  <option value="Tax Declaration">Tax Declaration</option>

                  <option value="Real Estate Tax Payment">
                    Real Estate Tax Payment
                  </option>
                  <option value="Certificate of Sale">
                    Certificate of Sale
                  </option>
                  <option value="LRA Assessment Form P.O.">
                    LRA Assessment Form P.O.
                  </option>
                  <option value="LRA O.R.">LRA O.R.</option>
                  <option value="Annotated Transfer Certificate of Title">
                    Annotated Transfer Certificate of Title
                  </option>

                  <option value="Certificate of Posting">
                    Certificate of Posting
                  </option>
                  <option value="Notice of Sheriff's Sale">
                    Notice of Sheriff's Sale
                  </option>
                  <option value="Tax Clearance">Tax Clearance</option>
                  <option value="Follow-up letter 1">Follow-up letter 1</option>
                  <option value="Follow-up letter 2">Follow-up letter 2</option>
                  <option value="Follow-up letter 3">Follow-up letter 3</option>
                </select>
                <FaChevronDown className={styles.icDown} />
              </div>
              <h3 className={styles.inputTitle}>Document Status</h3>
              <div className={styles.selectContainer}>
                <select
                  id="status"
                  name="status"
                  className={`${styles.input} ${styles.selectBox}`}
                  style={{ outline: 'none' }}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setIsValid(true);
                  }}
                >
                  <option value="">Select a status</option>
                  <option value="Missed">Missed</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Complete">Complete</option>
                </select>
                <FaChevronDown className={styles.icDown} />
              </div>
              <div className={styles.btn2}>
                <button
                  type="submit"
                  className={styles.btn + ' ' + styles.submit}
                  disabled={!isValid}
                >
                  Submit
                </button>
                <button className={styles.btn + ' ' + styles.cancel}>
                  <Link
                    className={styles.cancel_text}
                    to={`/client/detail/${client_id}`}
                  >
                    Cancel
                  </Link>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
