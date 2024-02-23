// Import required Electron modules
import { ipcRenderer } from 'electron';
import express from 'express';
import bodyParser from 'body-parser';
const cors = require('cors');
const mysql = require('mysql');
const myApp = express();
const port = 3001;

// Create a MySQL connection
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin123',
  database: 'prioritrack',
});

// Middleware
myApp.use(cors());
myApp.use(bodyParser.urlencoded({ extended: true }));
myApp.use(express.static('public'));

// Set up the view engine
myApp.set('view engine', 'ejs');

// Define routes
myApp.get('/', (req, res) => {
  res.render('login');
});

// Define route handler for login
myApp.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Check if username and password match
  if (username === 'egoreta') {
    // Perform MySQL query to retrieve password for 'egoreta' from the 'login' table
    connection.query(
      'SELECT password FROM login WHERE username = ?',
      [username],
      (err, results) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
          return res.send('User not found');
        }

        const dbPassword = results[0].password;
        if (password === dbPassword) {
          // Send successful login message to renderer process
          ipcRenderer.send('login-response', 'Login successful');
          res.send('Login successful');
        } else {
          res.send('Invalid password');
        }
      },
    );
  } else {
    res.send('Invalid username');
  }
});

// Start server
myApp.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
