import React from 'react';
import './spinner.css';

const Spinner = ({ loading }) => {
  return (
    loading && (
      <div className="spinner-wrapper">
        <div className="spinner-content">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="loading-text">Loading...</span>
        </div>
      </div>
    )
  );
};

export default Spinner;
