import React from 'react';
import ZkLend from '@/assets/icons/zklend_eth_collateral.svg?react';
import BorrowUSDC from '@/assets/icons/borrow_usdc.svg?react';
import EkuboSwap from '@/assets/icons/ekubo_swap.svg?react';
import Repeat from '@/assets/icons/repeats.svg?react';
import StarMaker from '@/components/layout/star-maker/StarMaker';

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
    <div className="relative flex w-[100%] flex-col items-center justify-between bg-[var(--primary-color)] pb-[100px] lg:pb-[350px]">
      <div className="absolute top-[15em] left-[15em] z-10 hidden h-[232px] w-[208px] -translate-x-1/2 rounded-[2000px_2000px_0_0] bg-[linear-gradient(73deg,_#74d6fd_1.13%,_#e01dee_103.45%)] blur-[80px] lg:block"></div>
      <StarMaker starData={starData} />
      <h1 className="font-text mt-[64px] mb-[180px] text-center text-[48px] font-[600] text-white">How it works</h1>

      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-[5em] px-4 sm:gap-[4em] lg:gap-[2em]">
        {CardData.map((card, index) => (
          <div key={index} className="relative flex flex-col items-center">
            <div className="absolute -top-[2em] left-1/2 z-10 -translate-x-1/2 md:-top-[1em] lg:-top-[1.5em] 2xl:-top-[1.5em]">
              <div className="bg-primary-color text-brand font-text z-7 min-w-[70px] rounded-xl border-[0.8px] border-[var(--brand)]  px-4 py-1 text-center text-[32px] font-semibold md:min-w-[45px] md:text-[18px] lg:min-w-[60px] lg:text-[25px] xl:text-[30px]">
                {card.number}
              </div>
            </div>

            <div className="shadow-card z-6 flex h-[368px] w-[310px] flex-col items-center gap-4 rounded-[20px] border border-[var(--card-border-1)] bg-[linear-gradient(135deg,_rgba(116,_214,_253,_0.5)_0%,_rgba(11,_12,_16,_0.5)_100%)] px-4 pt-[3em] backdrop-blur-[21.09375px] md:h-[205px] md:w-[175px] lg:h-[255px] lg:w-[250px] xl:h-[350px] xl:w-[280px] 2xl:pt-[3em]">
              <div className="flex h-[120px] w-[120px] items-center justify-center md:h-[60px] md:w-[60px] lg:h-[80px] lg:w-[80px] xl:h-[100px] xl:w-[100px]">
                <card.icon />
              </div>

              <h4 className="font-text text-primary text-center text-[26px] leading-[108%] font-medium md:text-[15px] lg:text-[18px] xl:text-[22px]">
                {card.title}
              </h4>

              <p className="font-text text-secondary lg:text-md text-center text-[20px] leading-[140%] font-normal md:text-[11px] xl:text-base">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-[25em] right-0 z-0 hidden h-[232px] w-[208px] rounded-[2000px_2000px_0_0] bg-[linear-gradient(73deg,_#74d6fd_1.13%,_#e01dee_103.45%)] blur-[100px] lg:block"></div>
    </div>
  );
};

export default About;
