import React from 'react';
import './partnership.css';
import { ReactComponent as ZklendLogo } from '../../../assets/images/zklend_logo.svg';
import { ReactComponent as EkuboLogo } from '../../../assets/images/ekubo_logo.svg';
import { ReactComponent as Star } from '../../../assets/particles/star.svg';

const Partnership = () => {
  const logos = [];
  const logoCount = 20; // Number of logo pairs

  for (let i = 0; i < logoCount; i++) {
    logos.push(<ZklendLogo key={`zklend-${i}`} />);
    logos.push(<EkuboLogo key={`ekubo-${i}`} />);
  }

  const starData = [{ top: 10, left: 75, size: 15 }];

  return (
    <div className="partnership-container">
      {starData.map((star, index) => (
        <Star
          key={index}
          style={{
            position: 'absolute',
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}%`,
            height: `${star.size}%`,
          }}
        />
      ))}
      <h1 className="partner-title">Partnership</h1>
      <div className="partnership-content">
        <div className="partnership-logo">{logos}</div>
      </div>
    </div>
  );
};

export default Partnership;
