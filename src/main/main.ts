/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
const bcrypt = require('bcryptjs');

const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const myApp = express();
const port = 3001;
require('dotenv').config();

// MIDDLEWARE
myApp.use(cors());
myApp.use(express.json());

var RateLimit = require('express-rate-limit');
var limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

myApp.use(limiter);

// MYSQL CONNECTION
// ENTER THIS IN QUERY IN MYSQL
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_current_password';
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect();

//LOGIN
myApp.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const query = 'SELECT password from users where username = ?';
  db.query(query, username, (err, data) => {
    if (err) return res.json(err);

    if (!data || data.length === 0) {
      return res.send(false);
    }

    const hash = data[0].password;
    bcrypt.compare(password, hash, function (err, result) {
      if (err) return res.status(500).send('Internal Server Error');

      if (result) {
        console.log('Success');
        res.send(result);
      } else {
        res.send(result);
      }
    });
  });
});

// VERIFICATION QUES
myApp.post('/forgotpass', (req, res) => {
  const { birthday, dog, mother } = req.body;
  console.log('Request Body:', req.body);

  // SQL query to check answers
  const sql = `
    SELECT
    CASE
      WHEN (sec_question = 'When is your birthday' AND sec_answer = ?)
           OR (sec_question = 'What is the name of your dog' AND sec_answer = ?)
           OR (sec_question = 'What is your mother''s maiden name' AND sec_answer = ?)
      THEN 'Correct'
      ELSE 'Incorrect'
    END AS verification_result
    FROM security`;
  console.log('SQL Query:', sql);

  // Execute SQL query
  db.query(sql, [birthday, dog, mother], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Query Results:', results);

    if (results.length === 0) {
      return res.send('Invalid answers');
    }

    // Get the verification result from the query results
    var verificationResult = '';
    const result1 = results[0].verification_result;
    const result2 = results[1].verification_result;
    const result3 = results[2].verification_result;
    if (result1 == 'Correct' && result2 == 'Correct' && result3 == 'Correct') {
      verificationResult = 'Correct';
    } else {
      verificationResult = 'Incorrect';
    }
    res.send(verificationResult);
  });
});

// ADD CLIENT
myApp.post('/client/add_submit', (req, res) => {
  const name = req.body.name;
  const property_location = req.body.property_location;
  const client_bank_name = req.body.client_bank_name;
  const client_bank_address = req.body.client_bank_address;
  const sql =
    'INSERT INTO clients (client_name,client_property_location,client_bank_name,client_bank_address) VALUES (?, ?, ?, ?)';
  db.query(
    sql,
    [name, property_location, client_bank_name, client_bank_address],
    (err, result) => {
      if (err) {
        console.error('Error inserting data into MySQL:', err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Data inserted into MySQL:', result);
        res.status(200).send('Contact added successfully');
      }
    },
  );
});

// ADD DOCUMENT TO CLIENT:ID
myApp.post('/client/document/add/:id', (req, res) => {
  const doc_status = req.body.doc_status;
  const doc_no = req.body.doc_no;
  const doc_date_submission = req.body.doc_date_submission;
  const doc_date_turnaround = req.body.doc_date_turnaround;
  const doc_type = req.body.doc_type;
  const client_id = req.body.client_id;
  console.log('SERVER') + client_id;
  const sql =
    'INSERT INTO documents (client_id, doc_no, doc_date_submission, doc_date_turnaround, doc_type, doc_status) VALUES (?, ?,? , ?, ?, ?)';
  db.query(
    sql,
    [
      client_id,
      doc_no,
      doc_date_submission,
      doc_date_turnaround,
      doc_type,
      doc_status,
    ],
    (err, result) => {
      if (err) {
        console.error('Error inserting data into MySQL:', err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Data inserted into MySQL:', result);
        res.status(200).send('Contact added successfully');
      }
    },
  );
});

// GET ALL USERS
myApp.get('/client/list', (req, res) => {
  const query = 'SELECT * FROM clients';
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});

//SORT FOR CLIENTS
//sort by clientName in ascending order
myApp.get('/client/list/clientName/asc', (req, res) => {
  const query = 'SELECT * FROM clients ORDER BY client_name ASC';
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});
//sort by clientName in descending order
myApp.get('/client/list/clientName/desc', (req, res) => {
  const query = 'SELECT * FROM clients ORDER BY client_name DESC';
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});
//sort by propertyLocation in ascending order
myApp.get('/client/list/propertyLocation/asc', (req, res) => {
  const query =
    'SELECT * FROM clients ORDER BY client_property_location ASC, client_name ASC';
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});
//sort by propertyLocation in descending order
myApp.get('/client/list/propertyLocation/desc', (req, res) => {
  const query =
    'SELECT * FROM clients ORDER BY client_property_location DESC, client_name ASC';
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});
//sort by clientBankName in ascending order
myApp.get('/client/list/clientBankName/asc', (req, res) => {
  const query =
    'SELECT * FROM clients ORDER BY client_bank_name ASC, client_name ASC';
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});
//sort by clientBankName in descending order
myApp.get('/client/list/clientBankName/desc', (req, res) => {
  const query =
    'SELECT * FROM clients ORDER BY client_bank_name DESC, client_name ASC';
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});
//sort by clientBankAddress in ascending order
myApp.get('/client/list/clientBankAddress/asc', (req, res) => {
  const query =
    'SELECT * FROM clients ORDER BY client_bank_address ASC, client_name ASC';
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});
//sort by clientBankAddress in descending order
myApp.get('/client/list/clientBankAddress/desc', (req, res) => {
  const query =
    'SELECT * FROM clients ORDER BY client_bank_address DESC, client_name ASC';
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});

// GET ALL USERS
myApp.get('/dashboard/list', (req, res) => {
  const query = `SELECT c.client_id,
    c.client_name,
    c.client_property_location,
    d.doc_no,
    d.doc_type,
    d.doc_status,
    d.doc_date_submission,
    d.doc_date_turnaround
  FROM clients c
  JOIN documents d ON c.client_id = d.client_id
  JOIN (
    SELECT client_id,
      MAX(doc_date_submission) AS newest_date,
      MAX(doc_id) AS max_doc_id
    FROM documents
    GROUP BY client_id
  ) d2 ON d.client_id = d2.client_id
    AND d.doc_date_submission = d2.newest_date
    AND d.doc_id = d2.max_doc_id`;
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});

//SORT FOR DASHBOARD
//sort by clientName in ascending order
myApp.get('/dashboard/list/clientName/asc', (req, res) => {
  const query = `SELECT c.client_id,
    c.client_name,
    c.client_property_location,
    d.doc_no,
    d.doc_type,
    d.doc_status,
    d.doc_date_submission,
    d.doc_date_turnaround
  FROM clients c
  JOIN documents d ON c.client_id = d.client_id
  JOIN (
    SELECT client_id,
      MAX(doc_date_submission) AS newest_date,
      MAX(doc_id) AS max_doc_id
    FROM documents
    GROUP BY client_id
  ) d2 ON d.client_id = d2.client_id
    AND d.doc_date_submission = d2.newest_date
    AND d.doc_id = d2.max_doc_id
  ORDER BY c.client_name ASC`;
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});
//sort by clientName in descending order
myApp.get('/dashboard/list/clientName/desc', (req, res) => {
  const query = `SELECT c.client_id,
    c.client_name,
    c.client_property_location,
    d.doc_no,
    d.doc_type,
    d.doc_status,
    d.doc_date_submission,
    d.doc_date_turnaround
  FROM clients c
  JOIN documents d ON c.client_id = d.client_id
  JOIN (
    SELECT client_id,
      MAX(doc_date_submission) AS newest_date,
      MAX(doc_id) AS max_doc_id
    FROM documents
    GROUP BY client_id
  ) d2 ON d.client_id = d2.client_id
    AND d.doc_date_submission = d2.newest_date
    AND d.doc_id = d2.max_doc_id
  ORDER BY c.client_name DESC, c.client_name ASC`;
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});
//sort by propertyLocation in ascending order
myApp.get('/dashboard/list/propertyLocation/asc', (req, res) => {
  const query = `SELECT c.client_id,
    c.client_name,
    c.client_property_location,
    d.doc_no,
    d.doc_type,
    d.doc_status,
    d.doc_date_submission,
    d.doc_date_turnaround
  FROM clients c
  JOIN documents d ON c.client_id = d.client_id
  JOIN (
    SELECT client_id,
      MAX(doc_date_submission) AS newest_date,
      MAX(doc_id) AS max_doc_id
    FROM documents
    GROUP BY client_id
  ) d2 ON d.client_id = d2.client_id
    AND d.doc_date_submission = d2.newest_date
    AND d.doc_id = d2.max_doc_id
  ORDER BY c.client_property_location ASC, c.client_name ASC`;
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});
//sort by propertyLocation in descending order
myApp.get('/dashboard/list/propertyLocation/desc', (req, res) => {
  const query = `SELECT c.client_id,
    c.client_name,
    c.client_property_location,
    d.doc_no,
    d.doc_type,
    d.doc_status,
    d.doc_date_submission,
    d.doc_date_turnaround
  FROM clients c
  JOIN documents d ON c.client_id = d.client_id
  JOIN (
    SELECT client_id,
      MAX(doc_date_submission) AS newest_date,
      MAX(doc_id) AS max_doc_id
    FROM documents
    GROUP BY client_id
  ) d2 ON d.client_id = d2.client_id
    AND d.doc_date_submission = d2.newest_date
    AND d.doc_id = d2.max_doc_id
  ORDER BY c.client_property_location DESC, c.client_name ASC`;
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});
//sort by mostRecentDocument in ascending order
myApp.get('/dashboard/list/mostRecentDocument/asc', (req, res) => {
  const query = `SELECT c.client_id,
    c.client_name,
    c.client_property_location,
    d.doc_no,
    d.doc_type,
    d.doc_status,
    d.doc_date_submission,
    d.doc_date_turnaround
  FROM clients c
  JOIN documents d ON c.client_id = d.client_id
  JOIN (
    SELECT client_id,
      MAX(doc_date_submission) AS newest_date,
      MAX(doc_id) AS max_doc_id
    FROM documents
    GROUP BY client_id
  ) d2 ON d.client_id = d2.client_id
    AND d.doc_date_submission = d2.newest_date
    AND d.doc_id = d2.max_doc_id
  ORDER BY d.doc_type ASC, c.client_name ASC`;
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});
//sort by mostRecentDocument in descending order
myApp.get('/dashboard/list/mostRecentDocument/desc', (req, res) => {
  const query = `SELECT c.client_id,
    c.client_name,
    c.client_property_location,
    d.doc_no,
    d.doc_type,
    d.doc_status,
    d.doc_date_submission,
    d.doc_date_turnaround
  FROM clients c
  JOIN documents d ON c.client_id = d.client_id
  JOIN (
    SELECT client_id,
      MAX(doc_date_submission) AS newest_date,
      MAX(doc_id) AS max_doc_id
    FROM documents
    GROUP BY client_id
  ) d2 ON d.client_id = d2.client_id
    AND d.doc_date_submission = d2.newest_date
    AND d.doc_id = d2.max_doc_id
  ORDER BY d.doc_type DESC, c.client_name ASC`;
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});
//sort by dateOfSubmission in ascending order
myApp.get('/dashboard/list/dateOfSubmission/asc', (req, res) => {
  const query = `SELECT c.client_id,
    c.client_name,
    c.client_property_location,
    d.doc_no,
    d.doc_type,
    d.doc_status,
    d.doc_date_submission,
    d.doc_date_turnaround
  FROM clients c
  JOIN documents d ON c.client_id = d.client_id
  JOIN (
    SELECT client_id,
      MAX(doc_date_submission) AS newest_date,
      MAX(doc_id) AS max_doc_id
    FROM documents
    GROUP BY client_id
  ) d2 ON d.client_id = d2.client_id
    AND d.doc_date_submission = d2.newest_date
    AND d.doc_id = d2.max_doc_id
  ORDER BY d.doc_date_submission ASC, c.client_name ASC`;
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});
//sort by dateOfSubmission in descending order
myApp.get('/dashboard/list/dateOfSubmission/desc', (req, res) => {
  const query = `SELECT c.client_id,
    c.client_name,
    c.client_property_location,
    d.doc_no,
    d.doc_type,
    d.doc_status,
    d.doc_date_submission,
    d.doc_date_turnaround
  FROM clients c
  JOIN documents d ON c.client_id = d.client_id
  JOIN (
    SELECT client_id,
      MAX(doc_date_submission) AS newest_date,
      MAX(doc_id) AS max_doc_id
    FROM documents
    GROUP BY client_id
  ) d2 ON d.client_id = d2.client_id
    AND d.doc_date_submission = d2.newest_date
    AND d.doc_id = d2.max_doc_id
  ORDER BY d.doc_date_submission DESC, c.client_name ASC`;
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});
//sort by status in ascending order
myApp.get('/dashboard/list/status/asc', (req, res) => {
  const query = `SELECT c.client_id,
    c.client_name,
    c.client_property_location,
    d.doc_no,
    d.doc_type,
    d.doc_status,
    d.doc_date_submission,
    d.doc_date_turnaround
  FROM clients c
  JOIN documents d ON c.client_id = d.client_id
  JOIN (
    SELECT client_id,
      MAX(doc_date_submission) AS newest_date,
      MAX(doc_id) AS max_doc_id
    FROM documents
    GROUP BY client_id
  ) d2 ON d.client_id = d2.client_id
    AND d.doc_date_submission = d2.newest_date
    AND d.doc_id = d2.max_doc_id
  ORDER BY d.doc_status ASC, c.client_name ASC`;
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});
//sort by status in descending order
myApp.get('/dashboard/list/status/desc', (req, res) => {
  const query = `SELECT c.client_id,
    c.client_name,
    c.client_property_location,
    d.doc_no,
    d.doc_type,
    d.doc_status,
    d.doc_date_submission,
    d.doc_date_turnaround
  FROM clients c
  JOIN documents d ON c.client_id = d.client_id
  JOIN (
    SELECT client_id,
      MAX(doc_date_submission) AS newest_date,
      MAX(doc_id) AS max_doc_id
    FROM documents
    GROUP BY client_id
  ) d2 ON d.client_id = d2.client_id
    AND d.doc_date_submission = d2.newest_date
    AND d.doc_id = d2.max_doc_id
  ORDER BY d.doc_status DESC, c.client_name ASC`;
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});

// GET CLIENT + CLIENT'S DOCUMENTS
myApp.get(`/list/:id`, (req, res) => {
  const userId = req.params.id;
  const id = parseInt(userId);
  const query = `
    SELECT u.*, d.*
    FROM clients u
    LEFT JOIN documents d ON u.client_id = d.client_id
    WHERE u.client_id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Server error' });
    } else {
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userData = {
        client_id: result[0].client_id,
        client_name: result[0].client_name,
        client_phone: result[0].client_phone,
        client_property_location: result[0].client_property_location,
        client_bank_name: result[0].client_bank_name,
        client_bank_address: result[0].client_bank_address,
        documents: [],
      };

      result.forEach((row) => {
        if (row.doc_id) {
          userData.documents.push({
            doc_id: row.doc_id,
            doc_name: row.doc_name,
            doc_no: row.doc_no,
            doc_date_submission: row.doc_date_submission,
            doc_date_turnaround: row.doc_date_turnaround,
            doc_type: row.doc_type,
            doc_status: row.doc_status,
          });
        }
      });

      res.json(userData);
      console.log(userData);
    }
  });
});
//SORT FOR DOCUMENTS
//sort by documentType in ascending order
myApp.get(`/list/:id/documentType/asc`, (req, res) => {
  const userId = req.params.id;
  const id = parseInt(userId);
  const query = `
    SELECT u.*, d.*
    FROM clients u
    LEFT JOIN documents d ON u.client_id = d.client_id
    WHERE u.client_id = ?
    ORDER BY d.doc_type ASC, d.client_id ASC`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Server error' });
    } else {
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      const userData = {
        client_id: result[0].client_id,
        client_name: result[0].client_name,
        client_phone: result[0].client_phone,
        client_property_location: result[0].client_property_location,
        client_bank_name: result[0].client_bank_name,
        client_bank_address: result[0].client_bank_address,
        documents: [],
      };
      result.forEach((row) => {
        if (row.doc_id) {
          userData.documents.push({
            doc_id: row.doc_id,
            doc_name: row.doc_name,
            doc_no: row.doc_no,
            doc_date_submission: row.doc_date_submission,
            doc_date_turnaround: row.doc_date_turnaround,
            doc_type: row.doc_type,
            doc_status: row.doc_status,
          });
        }
      });
      res.json(userData);
      console.log(userData);
    }
  });
});
//sort by documentType in descending order
myApp.get(`/list/:id/documentType/desc`, (req, res) => {
  const userId = req.params.id;
  const id = parseInt(userId);
  const query = `
    SELECT u.*, d.*
    FROM clients u
    LEFT JOIN documents d ON u.client_id = d.client_id
    WHERE u.client_id = ?
    ORDER BY d.doc_type DESC, d.client_id ASC`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Server error' });
    } else {
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      const userData = {
        client_id: result[0].client_id,
        client_name: result[0].client_name,
        client_phone: result[0].client_phone,
        client_property_location: result[0].client_property_location,
        client_bank_name: result[0].client_bank_name,
        client_bank_address: result[0].client_bank_address,
        documents: [],
      };
      result.forEach((row) => {
        if (row.doc_id) {
          userData.documents.push({
            doc_id: row.doc_id,
            doc_name: row.doc_name,
            doc_no: row.doc_no,
            doc_date_submission: row.doc_date_submission,
            doc_date_turnaround: row.doc_date_turnaround,
            doc_type: row.doc_type,
            doc_status: row.doc_status,
          });
        }
      });
      res.json(userData);
      console.log(userData);
    }
  });
});
//sort by dateOfSubmission in ascending order
myApp.get(`/list/:id/dateOfSubmission/asc`, (req, res) => {
  const userId = req.params.id;
  const id = parseInt(userId);
  const query = `
    SELECT u.*, d.*
    FROM clients u
    LEFT JOIN documents d ON u.client_id = d.client_id
    WHERE u.client_id = ?
    ORDER BY d.doc_date_submission ASC, d.client_id ASC`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Server error' });
    } else {
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      const userData = {
        client_id: result[0].client_id,
        client_name: result[0].client_name,
        client_phone: result[0].client_phone,
        client_property_location: result[0].client_property_location,
        client_bank_name: result[0].client_bank_name,
        client_bank_address: result[0].client_bank_address,
        documents: [],
      };
      result.forEach((row) => {
        if (row.doc_id) {
          userData.documents.push({
            doc_id: row.doc_id,
            doc_name: row.doc_name,
            doc_no: row.doc_no,
            doc_date_submission: row.doc_date_submission,
            doc_date_turnaround: row.doc_date_turnaround,
            doc_type: row.doc_type,
            doc_status: row.doc_status,
          });
        }
      });
      res.json(userData);
      console.log(userData);
    }
  });
});
//sort by dateOfSubmission in descending order
myApp.get(`/list/:id/dateOfSubmission/desc`, (req, res) => {
  const userId = req.params.id;
  const id = parseInt(userId);
  const query = `
    SELECT u.*, d.*
    FROM clients u
    LEFT JOIN documents d ON u.client_id = d.client_id
    WHERE u.client_id = ?
    ORDER BY d.doc_date_submission DESC, d.client_id ASC`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Server error' });
    } else {
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      const userData = {
        client_id: result[0].client_id,
        client_name: result[0].client_name,
        client_phone: result[0].client_phone,
        client_property_location: result[0].client_property_location,
        client_bank_name: result[0].client_bank_name,
        client_bank_address: result[0].client_bank_address,
        documents: [],
      };
      result.forEach((row) => {
        if (row.doc_id) {
          userData.documents.push({
            doc_id: row.doc_id,
            doc_name: row.doc_name,
            doc_no: row.doc_no,
            doc_date_submission: row.doc_date_submission,
            doc_date_turnaround: row.doc_date_turnaround,
            doc_type: row.doc_type,
            doc_status: row.doc_status,
          });
        }
      });
      res.json(userData);
      console.log(userData);
    }
  });
});
//sort by turnaroundDate in ascending order
myApp.get(`/list/:id/turnaroundDate/asc`, (req, res) => {
  const userId = req.params.id;
  const id = parseInt(userId);
  const query = `
    SELECT u.*, d.*
    FROM clients u
    LEFT JOIN documents d ON u.client_id = d.client_id
    WHERE u.client_id = ?
    ORDER BY d.doc_date_turnaround ASC, d.client_id ASC`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Server error' });
    } else {
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      const userData = {
        client_id: result[0].client_id,
        client_name: result[0].client_name,
        client_phone: result[0].client_phone,
        client_property_location: result[0].client_property_location,
        client_bank_name: result[0].client_bank_name,
        client_bank_address: result[0].client_bank_address,
        documents: [],
      };
      result.forEach((row) => {
        if (row.doc_id) {
          userData.documents.push({
            doc_id: row.doc_id,
            doc_name: row.doc_name,
            doc_no: row.doc_no,
            doc_date_submission: row.doc_date_submission,
            doc_date_turnaround: row.doc_date_turnaround,
            doc_type: row.doc_type,
            doc_status: row.doc_status,
          });
        }
      });
      res.json(userData);
      console.log(userData);
    }
  });
});
//sort by turnaroundDate in descending order
myApp.get(`/list/:id/turnaroundDate/desc`, (req, res) => {
  const userId = req.params.id;
  const id = parseInt(userId);
  const query = `
    SELECT u.*, d.*
    FROM clients u
    LEFT JOIN documents d ON u.client_id = d.client_id
    WHERE u.client_id = ?
    ORDER BY d.doc_date_turnaround DESC, d.client_id ASC`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Server error' });
    } else {
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      const userData = {
        client_id: result[0].client_id,
        client_name: result[0].client_name,
        client_phone: result[0].client_phone,
        client_property_location: result[0].client_property_location,
        client_bank_name: result[0].client_bank_name,
        client_bank_address: result[0].client_bank_address,
        documents: [],
      };
      result.forEach((row) => {
        if (row.doc_id) {
          userData.documents.push({
            doc_id: row.doc_id,
            doc_name: row.doc_name,
            doc_no: row.doc_no,
            doc_date_submission: row.doc_date_submission,
            doc_date_turnaround: row.doc_date_turnaround,
            doc_type: row.doc_type,
            doc_status: row.doc_status,
          });
        }
      });
      res.json(userData);
      console.log(userData);
    }
  });
});
//sort by status in ascending order
myApp.get(`/list/:id/status/asc`, (req, res) => {
  const userId = req.params.id;
  const id = parseInt(userId);
  const query = `
    SELECT u.*, d.*
    FROM clients u
    LEFT JOIN documents d ON u.client_id = d.client_id
    WHERE u.client_id = ?
    ORDER BY d.doc_status ASC, d.client_id ASC`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Server error' });
    } else {
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      const userData = {
        client_id: result[0].client_id,
        client_name: result[0].client_name,
        client_phone: result[0].client_phone,
        client_property_location: result[0].client_property_location,
        client_bank_name: result[0].client_bank_name,
        client_bank_address: result[0].client_bank_address,
        documents: [],
      };
      result.forEach((row) => {
        if (row.doc_id) {
          userData.documents.push({
            doc_id: row.doc_id,
            doc_name: row.doc_name,
            doc_no: row.doc_no,
            doc_date_submission: row.doc_date_submission,
            doc_date_turnaround: row.doc_date_turnaround,
            doc_type: row.doc_type,
            doc_status: row.doc_status,
          });
        }
      });
      res.json(userData);
      console.log(userData);
    }
  });
});
//sort by status in descending order
myApp.get(`/list/:id/status/desc`, (req, res) => {
  const userId = req.params.id;
  const id = parseInt(userId);
  const query = `
    SELECT u.*, d.*
    FROM clients u
    LEFT JOIN documents d ON u.client_id = d.client_id
    WHERE u.client_id = ?
    ORDER BY d.doc_status DESC, d.client_id ASC`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Server error' });
    } else {
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      const userData = {
        client_id: result[0].client_id,
        client_name: result[0].client_name,
        client_phone: result[0].client_phone,
        client_property_location: result[0].client_property_location,
        client_bank_name: result[0].client_bank_name,
        client_bank_address: result[0].client_bank_address,
        documents: [],
      };
      result.forEach((row) => {
        if (row.doc_id) {
          userData.documents.push({
            doc_id: row.doc_id,
            doc_name: row.doc_name,
            doc_no: row.doc_no,
            doc_date_submission: row.doc_date_submission,
            doc_date_turnaround: row.doc_date_turnaround,
            doc_type: row.doc_type,
            doc_status: row.doc_status,
          });
        }
      });
      res.json(userData);
      console.log(userData);
    }
  });
});

// GET ALL USERS (REPORT)
myApp.get('/reports/:month/:year', (req, res) => {
  const year = req.params.year;
  const month = req.params.month;
  const yearMonth = `${year}-${month.padStart(2, '0')}`;

  const query = `SELECT c.client_id,
    c.client_name,
    c.client_property_location,
    d.doc_no,
    d.doc_type,
    d.doc_status,
    d.doc_date_submission
  FROM clients c
  JOIN documents d ON c.client_id = d.client_id
  JOIN (
    SELECT client_id,
      MAX(doc_date_submission) AS newest_date,
      MAX(doc_id) AS max_doc_id
    FROM documents
    GROUP BY client_id
  ) d2 ON d.client_id = d2.client_id
    AND d.doc_date_submission = d2.newest_date
    AND d.doc_id = d2.max_doc_id
  WHERE LEFT(d.doc_date_submission, 7) = ?`;
  db.query(query, [yearMonth], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Server error' });
    } else {
      if (result.length === 0) {
        console.log('No records found for the selected month and year');
        return res.status(404).json({ message: 'No records found' });
      }

      const userData = result.map((row) => ({
        client_id: row.client_id,
        client_name: row.client_name,
        client_property_location: row.client_property_location,
        doc_no: row.doc_no,
        doc_type: row.doc_type,
        doc_status: row.doc_status,
        doc_date_submission: row.doc_date_submission,
        doc_date_turnaround: row.doc_date_turnaround,
      }));

      res.json(userData);
    }
  });
});
// sort reports
myApp.get('/reports/:month/:year/:column/:order', (req, res) => {
  const year = req.params.year;
  const month = req.params.month;
  const yearMonth = `${year}-${month.padStart(2, '0')}`;
  var column = '';
  var order = req.params.order.toUpperCase();
  if (req.params.column == 'clientName') {
    column = 'c.client_name';
  } else if (req.params.column == 'propertyLocation') {
    column = 'c.client_property_location';
  } else if (req.params.column == 'mostRecentDocument') {
    column = 'd.doc_type';
  } else if (req.params.column == 'dateOfSubmission') {
    column = 'd.doc_date_submission';
  } else if (req.params.column == 'status') {
    column = 'd.doc_status';
  }
  const sort = `${column} ${order}`;

  const query = `SELECT c.client_id,
    c.client_name,
    c.client_property_location,
    d.doc_no,
    d.doc_type,
    d.doc_status,
    d.doc_date_submission
  FROM clients c
  JOIN documents d ON c.client_id = d.client_id
  JOIN (
    SELECT client_id,
      MAX(doc_date_submission) AS newest_date,
      MAX(doc_id) AS max_doc_id
    FROM documents
    GROUP BY client_id
  ) d2 ON d.client_id = d2.client_id
    AND d.doc_date_submission = d2.newest_date
    AND d.doc_id = d2.max_doc_id
  WHERE LEFT(d.doc_date_submission, 7) = ?
  ORDER BY ${sort}, c.client_name ASC`;
  db.query(query, [yearMonth], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Server error' });
    } else {
      if (result.length === 0) {
        console.log('No records found for the selected month and year');
        return res.status(404).json({ message: 'No records found' });
      }

      const userData = result.map((row) => ({
        client_id: row.client_id,
        client_name: row.client_name,
        client_property_location: row.client_property_location,
        doc_no: row.doc_no,
        doc_type: row.doc_type,
        doc_status: row.doc_status,
        doc_date_submission: row.doc_date_submission,
        doc_date_turnaround: row.doc_date_turnaround,
      }));

      res.json(userData);
    }
  });
});

// GET CLIENT:ID
myApp.get('/client/update/:id', (req, res) => {
  const clientId = req.params.id;
  const query = 'SELECT * FROM clients WHERE client_id = ?';
  db.query(query, [clientId], (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});

// UPDATE /USERS/ID
myApp.post(`/list/edit/:id`, (req, res) => {
  const id = req.params.id;
  const client_name = req.body.client_name;

  const client_property_location = req.body.client_property_location;

  const client_bank_name = req.body.client_bank_name;

  const client_bank_address = req.body.client_bank_address;

  const query =
    'UPDATE clients SET client_name = ?, client_property_location = ?, client_bank_name = ?,client_bank_address = ? WHERE client_id = ?';
  const values = [
    client_name,
    client_property_location,
    client_bank_name,
    client_bank_address,
    id,
  ];
  db.query(query, values, (err, result) => {
    if (err) res.json({ message: 'Server error' });
    return res.json(result);
  });
});

// DELETE USER AND ALL DOCUMENTS
myApp.delete('/client/delete/:id', (req, res) => {
  const userId = req.params.id;
  const sql = `DELETE clients, documents FROM clients
    LEFT JOIN documents ON clients.client_id = documents.client_id
    WHERE clients.client_id = ?`;
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

// GET CLIENT:ID
myApp.get('/document/get/:id', (req, res) => {
  const docId = req.params.id;
  const query = 'SELECT * FROM documents WHERE doc_id = ?';
  db.query(query, [docId], (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});

// EDIT OR UPDATE DOCUMENT
myApp.post(`/document/edited/:id`, (req, res) => {
  const id = req.params.id;
  const doc_no = req.body.doc_no;
  const doc_date_submission = req.body.doc_date_submission;
  const doc_date_turnaround = req.body.doc_date_turnaround;
  const doc_type = req.body.doc_type;
  const doc_status = req.body.doc_status;
  const query =
    'UPDATE documents SET doc_no = ?, doc_date_submission = ?, doc_date_turnaround = ?, doc_type = ?, doc_status = ? WHERE doc_id = ?';
  const values = [
    doc_no,
    doc_date_submission,
    doc_date_turnaround,
    doc_type,
    doc_status,
    id,
  ];
  db.query(query, values, (err, result) => {
    if (err) res.json({ message: 'Server error' });
    return res.json(result);
  });
});

// DELETE DOCUMENT:ID
myApp.delete('/doc/delete/:id', (req, res) => {
  const docId = req.params.id;
  const sql = `DELETE FROM documents
    WHERE doc_id = ?`;
  db.query(sql, [docId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Document deleted successfully');
      res.status(200).send('Document deleted successfully');
    }
  });
});

//GET ID OF USERNAME
myApp.get('/user/get/:username', (req, res) => {
  const username = req.params.username;
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
});

//CHANGE PASSWORD
myApp.post(`/user/edit/:id`, (req, res) => {
  const id = req.params.id;
  const newPassword = req.body.password;

  bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    // Update in the database
    const query = 'UPDATE users SET password = ? WHERE user_id = ?';
    const values = [hash, id];
    db.query(query, values, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      return res.json({ message: 'Password updated successfully' });
    });
  });
});

// TEST SERVER CONNECTION
myApp.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    center: true,
    show: false,
    height: 1080,
    width: 1920,
    minHeight: 720,
    minWidth: 1280,
    icon: getAssetPath('circlelogo.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

//Notification
myApp.post('/notif', (req, res) => {
  const { client_name, doc_status } = req.body;
  const storedAt = new Date();

  const query =
    'INSERT INTO prioritrack.notification (client_name, doc_status, stored_at) VALUES (?, ?, ?)';
  db.query(query, [client_name, doc_status, storedAt], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error storing notification');
    } else {
      res.status(200).send('Notification stored successfully');
    }
  });
});

myApp.get('/notif', (req, res) => {
  // Calculate the date 3 days from now
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  // Format the date to match the format in your database
  const formattedDate = threeDaysFromNow.toISOString().slice(0, 10);

  const sql = `
  SELECT clients.client_name, documents.doc_date_turnaround, documents.doc_status
  FROM clients
  JOIN documents ON clients.client_id = documents.client_id
  WHERE documents.doc_date_turnaround >= CURDATE() AND documents.doc_date_turnaround <= ?
`;

  db.query(sql, [formattedDate], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res
        .status(500)
        .json({ error: 'An error occurred while fetching notifications.' });
      return;
    }
    // Assuming doc_status is a string indicating the status of the document
    // and you want to handle it accordingly in your React component
    res.json(results);
  });
});
