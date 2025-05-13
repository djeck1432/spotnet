import React, { useState } from 'react';
import MetricCard from '@/components/vault/metric-card/MetricCard';
import STRK from '@/assets/icons/strk.svg';
import USDCc from '@/assets/icons/apy_icon.svg';
import { VaultLayout } from '@/components/vault/VaultLayout';
import { cn } from '@/utils/cn';
import GasFee from '@/components/vault/gas-fee/GasFee';

function Stake() {
  const [selectedNetwork, setSelectedNetwork] = useState('Starknet');
  const [amount, setAmount] = useState('0');
  const [showDrop, setShowDrop] = useState(false);

  const networks = [{ name: 'Starknet', image: STRK }];
  const handleChange = (network) => {
    setSelectedNetwork(network.name);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value)) {
      setAmount(value);
    }
  };
  return (
    <VaultLayout>
      <div className="flex h-full min-h-screen w-screen flex-col items-center justify-center p-[7%] lg:ml-32 2xl:h-screen">
        <div className="flex h-full w-full max-w-[650px] flex-col items-center justify-center">
          <h1 className="mt-5 mb-10 text-center text-2xl text-white">zkLend Staking</h1>
          <div className="flex h-[103px] w-full items-stretch justify-between space-x-5">
            <MetricCard title="STRK Balance" value="0.046731" icon={STRK} />
            <MetricCard title="APY Balance" value="0.046731" icon={USDCc} />
          </div>

          <div className="mt-1.5">
            <p className="mt-3 mb-2 text-center text-lg text-white">Please submit your leverage details</p>
            <div className="mt-5 w-[650px] rounded-lg border border-[#36294e] p-5 px-7 pt-2">
              <div className="w-full">
                <div
                  className={cn(
                    'relative border-b border-b-[#36294E] py-1',
                    showDrop ? 'clicked-network-selector-container w-full' : 'network-selector-container'
                  )}
                  onMouseEnter={() => setShowDrop(true)}
                  onMouseLeave={() => setShowDrop(false)}
                >
                  <div className="relative z-[10] flex w-full cursor-pointer items-center justify-between gap-3 bg-[#120721] px-4 py-3 text-[1rem] text-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={networks.find((network) => network.name === selectedNetwork)?.image}
                        alt={selectedNetwork}
                        className="network-icon h-6 w-6 rounded-full"
                      />
                      <span>{selectedNetwork}</span>
                    </div>
                    <svg
                      className={`chevron ml-auto transform transition-transform duration-300 ease-in-out ${showDrop ? 'rotate-[180deg]' : 'rotate-[0deg]'} `}
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {showDrop && (
                    <div className="network-dropdown shadow-custom absolute top-[100%] left-0 z-[1] w-full rounded-sm group-hover:block">
                      {networks.map((network) => (
                        <div
                          key={network.name}
                          className={`network-option my-3 flex cursor-pointer items-center gap-[0.75rem] rounded-[2rem] bg-[#83919f] px-[1rem] py-[0.75rem] text-[#0b0c10] transition-transform duration-300 ease-in-out ${showDrop ? 'visibile' : 'invisible'} `}
                          onClick={() => handleChange(network)}
                        >
                          <img src={network.image} alt={network.name} className="network-icon" />
                          <span>{network.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div
                className="w my-15 flex h-[158px] flex-row items-center justify-center"
                aria-labelledby="amount-input-label"
              >
                <label className="flex w-full max-w-[140px] min-w-[142px] flex-col justify-center gap-3 font-semibold text-[#393942]">
                  <input
                    type="text"
                    id="amount-field"
                    value={amount}
                    onChange={handleAmountChange}
                    pattern="^\d*\.?\d*$"
                    className="amount-field w-full border-none bg-transparent text-center text-[64px] font-semibold text-[#83919f] outline-none"
                    aria-describedby="currency-symbol"
                    placeholder="0.00"
                    style={{
                      fontSize: '64px',
                    }}
                  />
                  <h3 className="text-center text-sm font-semibold">$0.00 APY / year</h3>
                </label>
                <div className="self-start text-sm font-medium text-[#393942]">STRK</div>
              </div>

              <GasFee />
            </div>
            <div class="relative mt-5 mb-5 rounded-lg bg-gradient-to-r from-[#74d6fd] to-[#e01dee] p-[1px] transition duration-100 ease-in-out hover:from-[#e01dee] hover:to-[#74d6fd]">
              <button class="h-full w-full cursor-pointer rounded-lg bg-[rgb(18,7,33)] px-4 py-4 font-semibold text-white">
                Stake
              </button>
            </div>
          </div>
        </div>
      </div>
    </VaultLayout>
  );
}

export default Stake;
