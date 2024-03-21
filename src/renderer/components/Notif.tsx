import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/notif.css';
import { FaBell } from 'react-icons/fa';
import { TbClipboardText } from 'react-icons/tb';
import { FaRegCircleCheck } from 'react-icons/fa6';

// Define the type for a notification
interface Notification {
  client_name: string;
  doc_date_deadline: string; // Adjust the type as necessary
  startTime: number;
  elapsedTime: number;
  docStatus: string; // Status from the database
}

export default function Notif() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:3001/notif')
      .then((response) => {
        const notificationsWithTimers = response.data.map((item) => ({
          ...item,
          startTime: new Date().getTime(),
          elapsedTime: 0,
          docStatus: item.doc_status,
        }));

        setNotifications(notificationsWithTimers);
      })
      .catch((error) => console.error('Error fetching notifications:', error));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNotifications((notifications) =>
        notifications.map((notification) => ({
          ...notification,
          elapsedTime: Math.floor(
            (new Date().getTime() - notification.startTime) / 1000,
          ),
        })),
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, [notifications]);

  // Function to store a new notification
  const storeNotification = (clientName, docStatus) => {
    axios
      .post(
        'http://localhost:3001/notif',
        {
          client_name: clientName,
          doc_status: docStatus,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));
  };

  // Function to format elapsed time dynamically
  const formatElapsedTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks > 0) return `${weeks}w`;
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  };

  return (
    <div className="dropdownNav link">
      <button className="dropbtn">
        <FaBell />
      </button>
      <div className="dropdown-content">
        {notifications.map((item, index) => (
          <a href="#" key={index}>
            <div className="icon">
              <TbClipboardText />
            </div>
            <div className="info">
              <div className="clientName">{item.client_name}</div>
              <div className="docStatus">{item.docStatus}</div>
            </div>
            <div className="time">{formatElapsedTime(item.elapsedTime)}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
