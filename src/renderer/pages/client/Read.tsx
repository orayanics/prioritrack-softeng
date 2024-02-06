import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Axios from 'axios';

export default function Read() {
  // FETCH DATA
  const [users, setUsers] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    Axios.get(`http://localhost:3001/list/${id}`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <div className="container">
      <p>UserDetail</p>
      {users.map((val) => {
        return (
          <div className="card-crud" key={val.idusers}>
            <p>{val.idusers}</p>
            <p>{val['name']}</p>
            <p>{val['phone']}</p>

            <button>
              <Link to={`/home`}>Back to List</Link>
            </button>
          </div>
        );
      })}
    </div>
  );
}
