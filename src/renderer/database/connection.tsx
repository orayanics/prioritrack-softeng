const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const port = 3001;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// MYSQL CONNECTION
// ENTER THIS IN QUERY IN MYSQL
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_current_password';
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin123',
  database: 'softeng',
});

db.connect();

// POST /USERS REQUEST
app.post('/add', (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  console.log('THIS IS SERVER ' + name, phone);
  const sql = 'INSERT INTO users (name, phone) VALUES (?, ?)';
  db.query(sql, [name, phone], (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Data inserted into MySQL:', result);
      res.status(200).send('Contact added successfully');
    }
  });
});

// GET /USERS ALL USERS
app.get('/list', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});

// GET /USERS/ID ALL USERS
app.get(`/list/:id`, (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM users where idusers = ?';
  db.query(query, [id], (err, result) => {
    if (err) res.json({ message: 'Server error' });
    return res.json(result);
  });
});

// UPDATE /USERS/ID
app.post(`/list/edit/:id`, (req, res) => {
  const id = req.params.id;
  const query = 'UPDATE users SET name = ?, phone = ? WHERE idusers = ?';
  const values = [req.body.name, req.body.phone, id];
  db.query(query, values, (err, result) => {
    if (err) res.json({ message: 'Server error' });
    return res.json(result);
  });
});

// DELETE USER
app.delete('/list/delete/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM users WHERE idusers = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('User deleted successfully');
      res.status(200).send('User deleted successfully');
    }
  });
});

// TEST SERVER CONNECTION
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
