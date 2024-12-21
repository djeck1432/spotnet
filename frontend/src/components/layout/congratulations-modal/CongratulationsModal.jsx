import React from 'react';
import './congratulationsModal.css';
import doneLogo from '../../../assets/icons/done-badge.svg';
import { useNavigate } from 'react-router-dom';

function CongratulationsModal({ message }) {
  const navigate = useNavigate();
  return (
    <div className="congratulationsModal">
      <h1>Congratulations</h1>
      <p>{message}</p>
      <img src={doneLogo} alt="" />
      <button className="gradient-button" onClick={() => navigate('/')}>
        <span>Back to homepage</span>
      </button>
    </div>
  );
}

export default CongratulationsModal;
