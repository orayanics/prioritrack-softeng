import { conn } from '../database/connection';

// Example function to get data from the database
export function getData() {
  const connection = new conn();

  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users', (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
      connection.end(); // Close the connection after the query is executed
    });
  });
}

// Example function to insert data into the database
// Example function to insert data into the database
export function insertData(data: any) {
  const connection = conn();

  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO users SET ?", data, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
      connection.end(); // Close the connection after the query is executed
    });
  });
}
