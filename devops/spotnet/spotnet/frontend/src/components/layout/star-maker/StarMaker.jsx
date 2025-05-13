import React from 'react';
import Star from '@/assets/particles/star.svg?react';

const StarMaker = ({ starData }) =>
  starData.map((star, index) => (
    <Star
      key={index}
      style={{
        position: 'absolute',
        top: `${star.top}%`,
        left: `${star.left}%`,
        width: `${star.size}%`,
        height: `${star.size}%`,
        zIndex: star.top === 0 && star.left === 76 && star.size === 8 ? -1 : 0,
      }}
    />
  ));

export default StarMaker;
