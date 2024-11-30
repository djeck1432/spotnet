import React, { useState } from 'react';
import { ReactComponent as ETH } from '../../../assets/icons/ethereum.svg';
import { ReactComponent as USDC } from '../../../assets/icons/borrow_usdc.svg';
// import { ReactComponent as STRK } from '../../../assets/icons/strk.svg
import { ReactComponent as DAI } from '../../../assets/icons/dai.svg';
import STRKIMG from '../../../assets/icons/strk.svg';
import './stake.css';
import { VaultLayout } from '../VaultLayout';
import { Button } from 'components/ui/Button';
import GasFee from 'components/GasFee/GasFee';
import BalanceCards from 'components/BalanceCards';
import { Image } from 'react-bootstrap';

function Stake() {
  const [selectedNetwork, setSelectedNetwork] = useState('Starknet');
  const [amount, setAmount] = useState('0');

  const [balances, setBalances] = useState([
    { icon: <Image src={STRKIMG} />, title: 'STRK', balance: '0.046731' },
    { icon: <USDC />, title: 'APY', balance: '0.046731' },
    { icon: <ETH />, title: 'ETH', balance: '0.046731' },
    { icon: <DAI />, title: 'DAI', balance: '0.046731' },
  ]);

  const networks = [{ name: 'Starknet', image: STRKIMG }];

  const handleChange = (e) => {
    setSelectedNetwork(e.target.value);
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
        <BalanceCards
          balances={balances}
          setBalances={setBalances}
          walletId={null}
        />
        <div className="stake-container">
          <h1 className="stake-title">Please submit your leverage details</h1>
          <div className="main-card">
            <div className="network-selector-container">
              <div className="network-selector">
                <div className="selected-network">
                  <Image
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

          <Button variant="secondary" size="lg" className="stake-button">
            Stake
          </Button>
        </div>
      </div>
    </VaultLayout>
  );
}



export default Stake;