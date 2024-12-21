import React from 'react';
import { ReactComponent as Star } from '../../../assets/particles/star.svg';

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
