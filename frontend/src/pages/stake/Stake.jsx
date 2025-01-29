import React, { useState } from 'react';
import MetricCard from '@/components/vault/stake-card/StakeCard';
import STRK from '@/assets/icons/strk.svg';
import USDCc from '@/assets/icons/apy_icon.svg';
import { VaultLayout } from '@/components/vault/VaultLayout';
import { Button } from '@/components/ui/custom-button/Button';
import GasFee from '@/components/vault/gas-fee/GasFee';
import BalanceCards from '@/components/ui/balance-cards/BalanceCards';

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
      <div className="flex justify-center items-center min-h-screen bg-cover bg-center px-4">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <div className="block md:hidden">
              <BalanceCards />
            </div>
            <div className="hidden md:block">
              <div className="flex justify-center gap-6">
                <MetricCard title="STRK Balance" value="0.046731" icon={STRK} />
                <MetricCard title="APY Balance" value="0.046731" icon={USDCc} />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h1 className="text-center text-white text-xl mb-6">Please submit your leverage details</h1>
            <div className="flex flex-col gap-6">
              <div
                onClick={() => setShowDrop(!showDrop)}
                className="relative cursor-pointer flex items-center justify-between p-3 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={networks.find((network) => network.name === selectedNetwork)?.image}
                    alt={selectedNetwork}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-white">{selectedNetwork}</span>
                </div>
                <svg
                  className={`w-6 h-6 transition-transform ${showDrop ? 'rotate-180' : ''}`}
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

                {showDrop && (
                  <div className="absolute top-full left-0 w-full bg-gray-600 rounded-xl shadow-lg z-10 mt-1">
                    {networks.map((network) => (
                      <div
                        key={network.name}
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray rounded-xl"
                        onClick={() => handleChange(network)}
                      >
                        <img src={network.image} alt={network.name} className="w-6 h-6 rounded-full" />
                        <span className="text-white">{network.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  id="amount-field"
                  value={amount}
                  onChange={handleAmountChange}
                  pattern="^\d*\.?\d*$"
                  className="w-full text-6xl text-center bg-transparent border-none text-gray-300 placeholder-gray focus:outline-none"
                  placeholder="0.00"
                />
                <span className="absolute text-gray right-1/3 top-1/2 transform -translate-y-1/2 text-xl">STRK</span>
              </div>

              <div className="text-center text-gray text-sm mt-4">$0.00 APY / year</div>
              <div className="my-6 border-t border-gray-700"></div>

              <GasFee />
            </div>

            <div className="flex justify-between gap-4 mt-6">
              <Button variant="secondary" size="lg" className="hidden md:block">
                Cancel
              </Button>
              <Button variant="secondary" size="lg" className="w-full md:w-1/2">
                Stake
              </Button>
            </div>
          </div>
        </div>
      </div>
    </VaultLayout>
  );
}

export default Stake;
