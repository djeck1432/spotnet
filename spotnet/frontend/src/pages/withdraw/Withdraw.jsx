import React from 'react';
import DiamondIcon from '@/assets/icons/diamond.svg?react';
import TimeIcon from '@/assets/icons/time.svg?react';
import SettingIcon from '@/assets/icons/settings.svg?react';
import MetricCard from '@/components/vault/metric-card/MetricCard';
import { VaultLayout } from '@/components/vault/VaultLayout';

export default function Withdraw() {
  return (
    <VaultLayout>
      <div className="flex h-full w-screen flex-col items-center justify-center lg:ml-32 2xl:h-screen">
        <div>
          <h1 className="mt-5 mb-10 text-center text-2xl text-white">zKLend Withdraw</h1>
          <div className="flex items-center space-x-5">
            <MetricCard title="Total Amount staked" value="324,909,894" />
            <MetricCard title="Daily Boost Multiplier" value="0.5%" />
          </div>
        </div>
        <div className="mt-1.5">
          <p className="mt-3 -mb-5 text-center text-lg text-white">Stake Withdrawal</p>
          <div className="mt-5 rounded-lg border border-[#36294e] p-5">
            <div className="flex w-[600px] items-center justify-between rounded-lg border border-[#36294e] bg-[#201338] px-5 py-10">
              <div className="flex flex-col items-center">
                <p className="flex items-center space-x-2">
                  <span>
                    <DiamondIcon />
                  </span>
                  <span className="text-[#83919f]">Your Stake</span>
                </p>
                <p className="text-2xl font-semibold text-white">13.89</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="flex items-center space-x-2">
                  <span>
                    <TimeIcon />
                  </span>
                  <span className="text-[#83919f]">Your Boost</span>
                </p>
                <p className="text-2xl font-semibold text-white">132.43%</p>
              </div>
            </div>

            <div className="flex flex-col items-start">
              <label htmlFor="withdraw-input" className="mt-10 -mb-3.5 text-[#83919f]">
                Input Unstake Amount
              </label>
              <input
                type="text"
                id="withdraw-input"
                placeholder="Enter Amount to Withdraw"
                className="mt-4 h-12 w-full rounded-lg border border-[#36294e] px-3 py-7 text-[#83919f] placeholder:text-[#83919f]"
              />
            </div>

            <div>
              <div className="mt-16 h-0.5 w-full bg-[#201338]"></div>
              <div className="mt-3 flex w-full items-center justify-between">
                <div className="rounded-full bg-[#201338] p-2">
                  <SettingIcon />
                </div>
                <p className="text-stormy-gray text-xs">Gas fee: 0.00 STRK</p>
              </div>
            </div>
          </div>
          <div class="relative mt-5 mb-5 rounded-lg bg-gradient-to-r from-[#74d6fd] to-[#e01dee] p-[2px]">
            <button class="h-full w-full cursor-pointer rounded-lg bg-[rgb(18,7,33)] px-4 py-3 font-semibold text-white">
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </VaultLayout>
  );
}
