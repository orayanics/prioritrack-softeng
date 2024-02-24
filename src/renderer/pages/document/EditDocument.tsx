import { useState, useEffect } from 'react';
import Axios from 'axios';
import styles from '../../styles/add_client.module.scss';
import { Outlet, Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditDoc() {
  const [doc, setDoc] = useState([]);
  const { id } = useParams();
  const doc_id = parseInt(id, 10);
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get(`http://localhost:3001/document/get/${id}`)
      .then((res) => {
        setDoc(res.data);
        console.log(doc_id);
        console.log(doc);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const [doc_status, setStatus] = useState('');
  const [doc_no, setNumber] = useState('');
  const [doc_date_submission, setDate] = useState('');
  const [doc_type, setType] = useState('');
  const [isValid, setIsValid] = useState(true);

    useEffect(() => {
      if (doc.length > 0) {
        const docu = doc[0];
        setNumber(docu.doc_no || '');
        setDate(docu.doc_date_submission || '');
        setType(docu.doc_type || '');
        setStatus(docu.doc_status || '');
      }
    }, [doc]);

  const updateDb = async (e) => {
    e.preventDefault();
    if (!doc_status || !doc_no || !doc_date_submission || !doc_type) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
    try {
      await Axios.post(`http://localhost:3001/document/edited/${doc_id}`, {
        doc_id,
        doc_status,
        doc_no,
        doc_date_submission,
        doc_type,
      });
      console.log('Success');
      navigate('/home');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={styles.containermain}>
      <div className={styles.container}>
        {doc.map((val) => (
          <div key={val.doc_id} className={styles.card}>
            <h1 className={styles.title}>Edit a Document</h1>
            <div className={styles.App}>
              <form onSubmit={updateDb}>
                <h3 className={styles.inputTitle}>Document Number</h3>
                <input
                  className={styles.input}
                  type="text"
                  value={doc_no}
                  onChange={(e) => setNumber(e.target.value)}
                />
                <h3 className={styles.inputTitle}>Document Date Submission</h3>
                <input
                  className={styles.input}
                  type="date"
                  value={doc_date_submission}
                  onChange={(e) => setDate(e.target.value)}
                />
                <h3 className={styles.inputTitle}>Document Type</h3>
                <input
                  className={styles.input}
                  type="text"
                  value={doc_type}
                  onChange={(e) => setType(e.target.value)}
                />
                <h3 className={styles.inputTitle}>Document Status</h3>
                <select
                  id="status"
                  name="status"
                  className={styles.input}
                  value={doc_status}
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
        ))}
      </div>
    </div>
  );
}

{
  /* {!isValid && (
          <div className={styles.alert}>
            <span className={styles.closebtn} onClick={() => setIsValid(true)}>
              &times;
            </span>
            <p>Please fill out all fields.</p>
          </div>
        )} */
}
