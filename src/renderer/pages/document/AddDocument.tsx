import { useState, FormEvent } from 'react';
import Axios from 'axios';
import Navbar from '../../components/Navbar';
import styles from '../../styles/add_client.module.scss';
import { Outlet, Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { cli } from 'webpack';

export default function AddDocument() {
  const navigate = useNavigate();

  const [doc_status, setStatus] = useState<string>('');
  const [doc_no, setNumber] = useState<string>('');
  const [doc_date_submission, setDate] = useState<string>('');
  const [doc_type, setType] = useState<string>('');
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
    await Axios.post('http://localhost:3001/client/document/add/:id', {
      client_id,
      doc_status,
      doc_no,
      doc_date_submission,
      doc_type,
    })
      .then(() => {
        console.log(
          'THIS IS FRONTEND AXIOS ' + client_id,
          doc_status,
          doc_no,
          doc_date_submission,
          doc_type,
        );
        console.log('Success');
        navigate('/home');
      })
      .catch((err) => {
        console.log(
          'AXIOS ERR ' + client_id,
          doc_status,
          doc_no,
          doc_date_submission,
          doc_type,
        );
        console.log(err);
      });
  };
  console.log(styles);
  return (
    <div className={styles.containermain}>
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
                className={styles.input}
                type="text"
                onChange={(e) => setNumber(e.target.value)}
              />
              <h3 className={styles.inputTitle}>Document Date Submission</h3>
              <input
                className={styles.input}
                type="date"
                onChange={(e) => setDate(e.target.value)}
              />
              <h3 className={styles.inputTitle}>Document Type</h3>
              <input
                className={styles.input}
                type="text"
                onChange={(e) => setType(e.target.value)}
              />
              <h3 className={styles.inputTitle}>Document Status</h3>
              <select
                id="status"
                name="status"
                className={styles.input}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select a status</option>
                <option value="Missed">Missed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Complete">Complete</option>
                <option value="On Hold">On Hold</option>
              </select>
              <div className={styles.btn2}>
                <button
                  type="submit"
                  className={styles.btn + ' ' + styles.submit}
                  disabled={!isValid}
                >
                  Submit
                </button>
                <button className={styles.btn + ' ' + styles.cancel}>
                  <Link className={styles.cancel_text} to={`/home`}>
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
