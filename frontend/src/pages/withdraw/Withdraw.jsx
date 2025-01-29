import React from 'react';
import DiamondIcon from '@/assets/icons/diamond.svg?react';
import TimeIcon from '@/assets/icons/time.svg?react';
import SettingIcon from '@/assets/icons/settings.svg?react';
import MetricCard from '@/components/vault/metric-card/MetricCard';
import { VaultLayout } from '@/components/vault/VaultLayout';

export default function Withdraw() {
  return (
    <VaultLayout>
      <div className="bg-cover bg-center min-h-screen flex justify-center items-center w-[calc(100vw-372px)] ml-[372px] transition-all duration-200 ease-in-out sm:w-full sm:ml-0">
        <div className="flex flex-col gap-6 justify-center">
          <h1 className="text-4xl font-semibold text-white text-center">zkLend Withdraw</h1>
          <div className="w-[642px] pt-6 rounded-lg text-primary text-center flex flex-col items-center gap-2 sm:w-full sm:px-4">
            <div className="flex gap-6 w-full h-[101px]">
              <MetricCard title="Total Amount staked" value="324,909,894" />
              <MetricCard title="Daily Boost Multiplier" value="0.5%" />
            </div>
          </div>
          <h1 className="text-xl font-light text-primary text-center">Stake withdrawal</h1>
          <div className="px-6 py-8 flex flex-col gap-10 rounded-lg border-midnightPurple sm:px-4">
            <div className="bg-footerDividerBg border-midnightPurple px-8 py-8 rounded-lg w-full flex justify-between items-center">
              <div className="text-center flex flex-col items-center">
                <div className="flex items-center text-stormyGray">
                  <img src={DiamondIcon} alt="diamond-icon" className="mr-1 w-4 h-4" />
                  <span className="label">Your Stack</span>
                </div>
                <div className="text-3xl">13.89</div>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="flex items-center text-stormyGray">
                  <img src={TimeIcon} alt="time-icon" className="mr-1 w-4 h-4" />
                  <span className="label">Your Boost</span>
                </div>
                <div className="text-3xl">132.43%</div>
              </div>
            </div>
            <div className="pt-2 pb-4">
              <div className="text-stormyGray text-base mb-1">Input Unstake Amount</div>
              <input type="text" className="w-full h-16 bg-transparent border-midnightPurple border-2 rounded-lg px-4 text-primary text-lg" placeholder="Enter Amount to Withdraw" />
            </div>
            <div className="w-full">
              <div className="w-full h-px bg-footerDividerBg mb-4"></div>
              <div className="flex justify-between items-center py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-footerDividerBg rounded-full flex justify-center items-center cursor-pointer">
                    <img src={SettingIcon} alt="settings-icon" className="w-4 h-4" />
                  </div>
                  <div className="text-stormyGray text-sm">Gas fee: 0.00 STRK</div>
                </div>
              </div>
            </div>
          </div>
          <button className="w-full h-16 text-primary text-lg font-semibold bg-transparent border-none cursor-pointer px-6 py-4 relative overflow-hidden rounded-lg z-10">
            Withdraw
          </button>
          <div className="hidden sm:flex flex-row-reverse justify-center gap-4 w-full mt-4">
            <button className="w-1/2 h-16 text-primary text-lg font-semibold bg-transparent border-none cursor-pointer">Withdraw</button>
            <button className="w-1/2 h-16 text-primary text-lg font-semibold bg-transparent border-midnightPurple border-2 rounded-lg cursor-pointer">Cancel</button>
          </div>
        </div>
      </div>
    </VaultLayout>
  );
}
