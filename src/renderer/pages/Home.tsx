// const { connectDb } = require('../database/conn.tsx');

// export default function Home() {

//   const getProducts = async () => {
//     const conn = await connectDb();
//     const results = await conn.query('SELECT * FROM users');
//     return results;
//   };

//   return (
//     <div>Home</div>
//   )
// }

import React, { useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [users, setUsers] = React.useState([]);

  // FETCH DATA ONCE
  useEffect(() => {
    fetchData();
  }, []);

  // PUT INTO FUNCTION GET USERS
  const fetchData = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/list');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // DELETE ONCLICK HANDLER
  const deleteData = async (id) => {
    try {
      const response = await Axios.delete(
        `http://localhost:3001/list/delete/${id}`,
      );
      fetchData();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
    <div className="container">
      <p>UserList</p>
      {users.map((val) => {
        return (
          <div className="card-crud" key={val.idusers}>
            <p>{val.idusers}</p>
            <p>{val.name}</p>
            <p>{val.phone}</p>
            <button>
              <Link to={`/list/${val.idusers}`}>Read</Link>
            </button>
            <button>
              <Link to={`/list/edit/${val.idusers}`}>Update</Link>
            </button>
            <button onClick={() => deleteData(val.idusers)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}
