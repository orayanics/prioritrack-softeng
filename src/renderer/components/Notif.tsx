import React from 'react';
import { FaBell } from 'react-icons/fa';
import '../styles/notif.css';
import { TbClipboardText } from 'react-icons/tb';
import { FaRegCircleCheck } from 'react-icons/fa6';

export default function Notif() {
  return (
    <div className="dropdownNav link">
      <button className="dropbtn">
        <FaBell />
      </button>
      <div className="dropdown-content">
        <div className="dropdown-actions">
          <button className="clear-all-btn">Clear All</button>
        </div>
        <a href="#">
          <div className="icon">
            <TbClipboardText />
          </div>
          <div className="info">
            <div className="clientName">Aliah</div>
            <div className="docStatus">Upcoming Deadline</div>
          </div>
          <div className="time">1hr</div>
        </a>
        <a href="#">
          <div className="icon">
            <FaRegCircleCheck />
          </div>
          <div className="info">
            <div className="clientName">Ashley</div>
            <div className="docStatus">Missed Deadline</div>
          </div>
          <div className="time">3hr</div>
        </a>
      </div>
    </div>
  );
}