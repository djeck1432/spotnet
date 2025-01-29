import React from 'react';
import ZkLend from '../../../assets/icons/zklend_eth_collateral.svg';
import BorrowUSDC from '../../../assets/icons/borrow_usdc.svg';
import EkuboSwap from '../../../assets/icons/ekubo_swap.svg';
import Repeat from '../../../assets/icons/repeats.svg';
import StarMaker from '../../layout/star-maker/StarMaker';

const CardData = [
  {
    number: '1',
    title: 'ZkLend ETH collateral',
    description: 'ETH/STRK from your wallet is deposited as collateral on ZkLend.',
    icon: ZkLend,
  },
  {
    number: '2',
    title: 'Borrow USDC',
    description: 'You borrow USDC against that collateral.',
    icon: BorrowUSDC,
  },
  {
    number: '3',
    title: 'Ekubo Swap',
    description: 'The USDC is swapped back to ETH on Ekubo.',
    icon: EkuboSwap,
  },
  {
    number: '4',
    title: 'Repeats',
    description: 'The process repeats, compounding up to five times.',
    icon: Repeat,
  },
];

const About = () => {
  const starData = [
    { top: 10, left: 5, size: 5 },
    { top: 85, left: 10, size: 10 },
    { top: 7, left: 80, size: 8 },
  ];

  return (
    <div className="relative flex flex-col items-center justify-between w-full bg-primary-color mb-80">
      <StarMaker starData={starData} />
      <h1 className="text-center font-semibold text-4xl text-white mt-20 mb-36">How it works</h1>
      <div className="flex flex-wrap gap-8 justify-center">
        <div className="absolute bg-main-gradient blur-[90px] w-64 h-52 top-[16%] left-[-2%]"></div>
        <div className="absolute bg-main-gradient blur-[95px] w-64 h-52 bottom-[-20%] right-[-3%]"></div>
        {CardData.map((card, index) => (
          <div
            key={index}
            className="relative flex flex-col gap-4 w-72 h-92 bg-card-bg-gradient rounded-2xl border border-gray-300 shadow-xl backdrop-blur-xl p-4 text-white"
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-12 flex items-center justify-center bg-primary-color border border-brand rounded-xl">
              <h2 className="text-lg font-bold text-brand">{card.number}</h2>
            </div>
            <div className="flex justify-center items-center w-28 h-28 mx-auto">
              <img src={card.icon} alt="card-icon" className="w-full h-full" />
            </div>
            <h4 className="text-center text-xl font-medium text-gray-800">{card.title}</h4>
            <h6 className="text-center text-lg font-light text-gray-600">{card.description}</h6>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
