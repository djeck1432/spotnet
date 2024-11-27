import './dont_miss.css';
import React from 'react';
import { ReactComponent as Rocket } from 'assets/icons/rocket.svg';
import { ReactComponent as Hand } from 'assets/images/hand.svg';
import { ReactComponent as Star } from 'assets/particles/star.svg';
import { useNavigate } from 'react-router-dom';
import {  notify } from 'components/Notifier/Notifier';

const DontMiss = ({ walletId }) => {
  const navigate = useNavigate();

  const handleLaunchApp = async () => {
    if (walletId) {
      navigate('/form');
    } else {
      notify('Please connect to your wallet');
    }
  };
  const starData = [
    { top: 45, left: 8, size: 25 },
    { top: 150, left: 70, size: 25 },
  ];
  return (
    <div className="dont-miss__container">
      <div className="text-container">
        {' '}
        <h1 className="miss-title">Don&apos;t miss out</h1>
        <p className="miss-description">Investing wisely would be the smartest move you&apos;ll make!</p>
      </div>

      {starData.map((star, index) => (
        <Star
          key={index}
          className="miss-star"
          style={{
            '--star-top': `${star.top}%`,
            '--star-left': `${star.left}%`,
            '--star-size': `${star.size}%`,
          }}
        />
      ))}
      <div className="miss-button">
        <button className="launch-button" onClick={handleLaunchApp}>
          <div className="btn-elements">
            <span className="button-text">Launch App</span>
            <Rocket className="rocket-icon" />
          </div>
        </button>
        <Hand className="hand-icon" />
      </div>
    </div>
  );
};

export default DontMiss;
