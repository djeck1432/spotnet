import React from 'react';
import Hand from '@/assets/images/hand.svg?react';
import Star from '@/assets/particles/star.svg?react';
import { useNavigate } from 'react-router-dom';
import { notify } from '@/components/layout/notifier/Notifier';
import { useWalletStore } from '@/stores/useWalletStore';
import JoinButton from '../../gradientbutton';

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
    <div className="mt-[60px] mb-[50px] flex h-auto flex-col items-center justify-center lg:mb-[250px]">
      <div className="text-container">
        <h1 className="text-center text-[48px] font-[600] text-white">Don&apos;t miss out</h1>
        <p className="mb-0 text-center text-[20px] font-[400] text-white">
          Investing wisely would be the smartest move you&apos;ll make!
        </p>
      </div>

      {starData.map((star, index) => (
        <Star
          key={index}
          className="miss-star hidden lg:absolute"
          style={{
            '--star-top': `${star.top}% `,
            '--star-left': `${star.left}%`,
            '--star-size': `${star.size}%`,
          }}
        />
      ))}
      <div className="relative">
        <JoinButton onClick={handleLaunchApp}>Launch App</JoinButton>
        <Hand className="absolute top-[26px] right-[-44px] h-[114px] w-[114px] lg:right-[-53px] lg:h-[135px] lg:w-[135px]" />
      </div>
      <div>
        <div className="absolute bottom-175 left-125 h-[232px] w-[208px] -translate-x-1/2 rounded-[2000px_2000px_0_0] bg-[linear-gradient(73deg,_#74d6fd_1.13%,_#e01dee_103.45%)] blur-[80px]"></div>
        <div className="absolute right-110 bottom-200 h-[232px] w-[208px] translate-x-1/2 rounded-[2000px_2000px_0_0] bg-[linear-gradient(73deg,_#74d6fd_1.13%,_#e01dee_103.45%)] blur-[80px]"></div>
      </div>
    </div>
  );
};

export default DontMiss;
