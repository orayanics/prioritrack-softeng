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

const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const myApp = express();
const port = 3001;

// MIDDLEWARE
myApp.use(cors());
myApp.use(express.json());

// MYSQL CONNECTION
// ENTER THIS IN QUERY IN MYSQL
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_current_password';
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'prioritrack',
});

db.connect();

// ADD CLIENT
myApp.post('/client/add_submit', (req, res) => {
  const name = req.body.name;
  const property_location = req.body.property_location;
  const client_bank_name = req.body.client_bank_name;
  const client_bank_address = req.body.client_bank_address;
  console.log(
    'THIS IS SERVER ' + name,
    property_location,
    client_bank_name,
    client_bank_address,
  );
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
  const doc_type = req.body.doc_type;
  const client_id = req.body.client_id;
  console.log('SERVER') + client_id;
  const sql =
    'INSERT INTO documents (client_id, doc_no, doc_date_submission, doc_type, doc_status) VALUES (?, ?, ?, ?, ?)';
  db.query(
    sql,
    [client_id, doc_no, doc_date_submission, doc_type, doc_status],
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
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
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
