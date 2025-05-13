import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultStyles = {
  success: { backgroundColor: 'green', color: 'white' },
  error: { backgroundColor: 'red', color: 'white' },
  warning: { backgroundColor: 'orange', color: 'white' },
  info: { backgroundColor: 'blue', color: 'white' },
};

const ToastWithLink = (message, link, linkMessage) => (
  <div>
    <span>{message}</span>{' '}
    <a target="_blank" href={link}>
      {linkMessage}
    </a>
  </div>
);

const notify = (message, type = 'info', autoClose = 3000) =>
  toast(message, { type, autoClose, style: defaultStyles[type] || defaultStyles.info });

const Notifier = () => {
  return (
    <div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export { Notifier, notify, ToastWithLink };
