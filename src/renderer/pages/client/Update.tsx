import React from 'react';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Update() {
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

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const updateDb = async (e) => {
    e.preventDefault();
    // Make a POST request to the server
    await Axios.post(`http://localhost:3001/list/edit/${id}`, { name, phone })
      .then(() => {
        console.log('THIS IS FRONTEND AXIOS ' + name, phone);
        console.log('Success');
      })
      .catch((err) => {
        console.log('THIS IS FRONTEND AXIOS ERR ' + name, phone);
        console.log(err);
      });
  };
  return (
    <div className="container">
      <p>UserDetail</p>
      {users.map((val) => {
        return (
          <div className="card-crud" key={val.idusers}>
            <p>{val['idusers']}</p>
            <p>{val['name']}</p>
            <p>{val['phone']}</p>

            <form onSubmit={updateDb}>
              <label>Name</label>
              <input
                type="text"
                placeholder={val.name}
                onChange={(e) => setName(e.target.value)}
              ></input>
              <label>Phone</label>
              <input
                type="text"
                placeholder={val.phone}
                onChange={(e) => setPhone(e.target.value)}
              ></input>
              <button>
                <Link to={`/list`}>Back to List</Link>
              </button>
              <button type="Submit">ENTER</button>
            </form>
          </div>
        );
      })}
    </div>

    // <div className="App">
    //   <form onSubmit={updateDb}>
    //     <label>Name</label>
    //     <input type="text" onChange={(e) => setName(e.target.value)}></input>
    //     <label>Phone</label>
    //     <input type="text" onChange={(e) => setPhone(e.target.value)}></input>
    //     <button type="Submit">ENTER</button>
    //   </form>
    // </div>
  );
}
