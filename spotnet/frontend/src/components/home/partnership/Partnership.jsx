import React from 'react';
import ZklendLogo from '@/assets/images/zklend_logo.svg?react';
import EkuboLogo from '@/assets/images/ekubo_logo.svg?react';
import Star from '@/assets/particles/star.svg?react';
const Partnership = () => {
  const logos = [];
  const logoCount = 20;

  for (let i = 0; i < logoCount; i++) {
    logos.push(<ZklendLogo key={`zklend-${i}`} className="mx-5 h-[100px] w-[150px] shrink-0" />);
    logos.push(<EkuboLogo key={`ekubo-${i}`} className="mx-5 h-[100px] w-[150px] shrink-0" />);
  }

  const starData = [{ top: 10, left: 75, size: 15 }];

  return (
    <div className="relative">
      {starData.map((star, index) => (
        <Star
          key={index}
          className="absolute"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}%`,
            height: `${star.size}%`,
          }}
        />
      ))}
      <h1 className="mb-[130px] text-center text-[48px] font-semibold text-white">Partnership</h1>
      <div className="relative flex h-[150px] w-screen items-center overflow-hidden bg-gradient-to-r from-[var(--gradient-from)] via-purple-400 to-purple-500">
        <div className="partnership-logo animate-scroll relative flex items-center justify-start [&>*]:mx-[20px] [&>*]:h-[100px] [&>*]:w-[150px] [&>*]:flex-shrink-0">
          {logos}
        </div>
      </div>
    </div>
  );
};

export default Partnership;
