import React, { useState } from 'react';
import { ReactComponent as ETH } from '../../../assets/icons/ethereum.svg';
import { ReactComponent as USDC } from '../../../assets/icons/borrow_usdc.svg';
import { ReactComponent as DAI } from '../../../assets/icons/dai.svg';
import { ReactComponent as STTRK } from '../../../assets/icons/strk.svg'
import MetricCard from 'components/StakeCard/MetricCard';
import STRK from '../../../assets/icons/strk.svg';
import USDCc from '../../../assets/icons/apy_icon.svg';
import './stake.css';
import { VaultLayout } from '../VaultLayout';
import { Button } from 'components/ui/Button';
import GasFee from 'components/GasFee/GasFee';
import BalanceCards from 'components/BalanceCards';

function Stake() {
  const [selectedNetwork, setSelectedNetwork] = useState('Starknet');
  const [amount, setAmount] = useState('0');
  const [showDrop, setShowDrop] = useState(false)

  const [balances, setBalances] = useState([
    { icon: <STTRK />, title: 'STRK', balance: '0.046731' },
    { icon: <USDC />, title: 'APY', balance: '0.046731' },
    { icon: <ETH />, title: 'ETH', balance: '0.046731' },
    { icon: <DAI />, title: 'DAI', balance: '0.046731' },
  ]);
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
    <VaultLayout >
      <div className="stake-wrapper">
        <div className="stake-container">
          <h1 className='stake-header-text'>zkLend Staking</h1>
          <div className='stake-balance'>
            <div className="balance-display-container">
              <div className="large-screen-balance">
                <div className='main-container'>
                  <div className='top-cards'>
                    <MetricCard title="STRK Balance" value="0.046731" icon={STRK} />
                    <MetricCard title="APY Balance" value="0.046731" icon={USDCc} />
                  </div>
                </div>
              </div>
              <div className="mobile-screen-balance">
                <BalanceCards
                  balances={balances}
                  setBalances={setBalances}
                  walletId={null}
                />
              </div>
            </div>
            <div className='stake-main-container'>
              <h1 className="stake-title">Please submit your leverage details</h1>
                <div className="main-card">
                  <div onClick={() => setShowDrop(!showDrop)} className={showDrop ? "clicked-network-selector-container" : "network-selector-container"}>
                    <div className="network-selector">
                      <div className="selected-network">
                        <img
                          src={networks.find((network) => network.name === selectedNetwork)?.image}
                          alt={selectedNetwork}
                          className="network-icon"
                        />
                        <span>{selectedNetwork}</span>
                      </div>
                      <svg
                        className="chevron"
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

                    <div className="network-dropdown">
                      {networks.map((network) => (
                        <div key={network.name} className="network-option" onClick={() => handleChange(network)}>
                          <img src={network.image} alt={network.name} className="network-icon" />
                          <span>{network.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="amount-input" aria-labelledby="amount-input-label">
                    <input
                      type="text"
                      id="amount-field"
                      value={amount}
                      onChange={handleAmountChange}
                      pattern="^\d*\.?\d*$"
                      className="amount-field"
                      aria-describedby="currency-symbol"
                      placeholder="0.00"
                    />
                    <span id="currency-symbol" className="currency">STRK</span>
                  </div>

                  <div className="apy-rate">$0.00 APY / year</div>
                  <GasFee />
                </div>

            </div>
            <Button variant="secondary" size="lg" className="stake-button">
              Stake
            </Button>
          </div>
        </div>
      </div>
    </VaultLayout>
  );
}



export default Stake;