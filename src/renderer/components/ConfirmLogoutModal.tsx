import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from '../styles/confirm_logout.module.scss';
const ConfirmLogoutModal = ({ show, handleClose, handleLogout }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <h3 className={styles.titleDelete}>
            Are you sure you want to logout?
          </h3>
          <div className={styles.midDelete}>
            <button
              onClick={handleLogout}
              className={styles.btn + ' ' + styles.cancel}
            >
              Confirm
            </button>
            <button
              onClick={handleClose}
              className={styles.btn + ' ' + styles.submit}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmLogoutModal;
