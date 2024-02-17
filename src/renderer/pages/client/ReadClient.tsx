import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";

export default function UserList() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true); // Set loading state to true when fetching data
    Axios.get(`http://localhost:3001/list/${id}`)
      .then((res) => {
        setUserData(res.data);
        console.log(res.data);
        setLoading(false); // Set loading state to false after data is fetched
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false); // Set loading state to false on error
      });
  }, [id]);

  return (
    <div className="container">
      <p>User Details</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card-crud">
          <div>
            <p>Client ID: {id}</p>
            <p>Client Name: {userData.client_name}</p>
            <p>Client Property Location: {userData.client_property_location}</p>
            <p>Client Bank Name: {userData.client_bank_name}</p>
            <p>Client Bank Address: {userData.client_bank_address}</p>
          </div>
          <button>
            <Link to="/list">Back to List</Link>
          </button>
          <button>
            <Link to={`/client/document/`+`${id}`}>Add Document</Link>
          </button>
        </div>
      )}

      <p>Documents</p>
      {loading ? (
        <p>Loading...</p>
      ) : userData.documents && userData.documents.length > 0 ? (
        userData.documents.map((doc) => (
          <div className="card-crud" key={doc.doc_id}>
            <p>Document ID: {doc.doc_id}</p>
            <p>Document Number: {doc.doc_no}</p>
            <p>Document Date Submission: {doc.doc_date_submission}</p>
            <p>Document Type: {doc.doc_type}</p>
            <p>Document Status: {doc.doc_status}</p>
          </div>
        ))
      ) : (
        <p>No documents found</p>
      )}
    </div>
  );
}
