import React from 'react';
import { ReactComponent as ZklendLogo } from '../../../assets/images/zklend_logo.svg';
import { ReactComponent as EkuboLogo } from '../../../assets/images/ekubo_logo.svg';
import { ReactComponent as Star } from '../../../assets/particles/star.svg';

const Partnership = () => {
  const logos = [];
  const logoCount = 20; // Number of logo pairs

  for (let i = 0; i < logoCount; i++) {
    logos.push(<ZklendLogo key={`zklend-${i}`} className="w-36 h-24 mx-5 shrink-0" />);
    logos.push(<EkuboLogo key={`ekubo-${i}`} className="w-36 h-24 mx-5 shrink-0" />);
  }

  const starData = [{ top: '10%', left: '75%', size: '15%' }];

  return (
    <div className="relative">
      {starData.map((star, index) => (
        <Star
          key={index}
          className="absolute"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
          }}
        />
      ))}
      <h1 className="text-center font-bold text-primary mb-32 text-4xl md:text-3xl sm:text-2xl">Partnership</h1>
      <div className="w-screen h-36 bg-gradient-to-r from-blue-500 to-purple-500 flex relative overflow-hidden">
        <div className="flex items-center justify-start animate-scroll w-[calc(150px*8*2)]">
          {logos}
        </div>
      </div>
    </div>
  );
};

export default Partnership;
