import React from 'react';
import Rocket from '@/assets/icons/rocket.svg';
import Hand from '@/assets/images/hand.svg';
import Star from '@/assets/particles/star.svg';
import { useNavigate } from 'react-router-dom';
import { notify } from '@/components/layout/notifier/Notifier';
import { useWalletStore } from '@/stores/useWalletStore';

const DontMiss = () => {
  const { walletId } = useWalletStore();
  const navigate = useNavigate();

  const handleLaunchApp = async () => {
    if (walletId) {
      navigate('/form');
    } else {
      notify('Please connect to your wallet', 'warning');
    }
  };

  const starData = [
    { top: 45, left: 8, size: 25 },
    { top: 150, left: 70, size: 25 },
  ];

  return (
    <div className="flex flex-col items-center justify-center mt-16 mb-64 relative">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-white">Don&apos;t miss out</h1>
        <p className="text-lg font-normal text-secondary mt-2">
          Investing wisely would be the smartest move you&apos;ll make!
        </p>
      </div>

      {starData.map((star, index) => (
        <img
          src={Star}
          alt="star-icon"
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

      <div className="relative mt-8">
        <button
          className="bg-main-gradient hover:bg-button-gradient-hover text-white font-bold py-3 px-12 rounded-lg flex items-center justify-center"
          onClick={handleLaunchApp}
        >
          <div className="flex items-center gap-3">
            <span className="text-black">Launch App</span>
            <img src={Rocket} alt="rocket" className="w-5 h-5" />
          </div>
        </button>
        <img
          src={Hand}
          alt="hand"
          className="absolute right-[-2.5rem] top-6 w-32 h-32 md:w-28 md:h-28 lg:w-36 lg:h-36"
        />
      </div>
    </div>
  );
};

export default DontMiss;
