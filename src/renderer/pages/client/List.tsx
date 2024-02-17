import React, { useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = React.useState([]);

  // FETCH DATA ONCE
  useEffect(() => {
    fetchData();
  }, []);

  // PUT INTO FUNCTION GET USERS
  const fetchData = async () => {
    try {
      const response = await Axios.get("http://localhost:3001/list");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // DELETE ONCLICK HANDLER
  const deleteData = async (id) => {
    try {
      const response = await Axios.delete(
        `http://localhost:3001/list/delete/${id}`
      );
      fetchData();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div className="container">
      <p>UserList</p>
      {users.map((val) => {
        return (
          <div className="card-crud" key={val.client_id}>
            <p>{val.client_name}</p>
            <p>{val.client_property_location}</p>
            <p>{val.client_bank_name}</p>
            <p>{val.client_bank_address}</p>
            <button>
              <Link to={`/list/${val.client_id}`}>Read</Link>
            </button>
            <button>
              <Link to={`/list/edit/${val.client_id}`}>Update</Link>
            </button>
            <button onClick={() => deleteData(val.client_id)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}
