
import React, { useState } from 'react';
import Card from 'components/Card/Card';
import TokenSelector from 'components/TokenSelector/TokenSelector';
import { ReactComponent as HealthIcon } from 'assets/icons/health.svg';
import { ReactComponent as EthIcon } from 'assets/icons/ethereum.svg';
import { validateNumberInput } from '../../../../utils/regex';
import { useAddDeposit } from 'hooks/useAddDeposit';
import './AddDeposit.css';

export default function AddDeposit() {
  const [amount, setAmount] = useState('0');
  const [selectedToken, setSelectedToken] = useState('STRK');
  
  const { mutate: addDeposit, isLoading } = useAddDeposit();

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (validateNumberInput(value)) {
      setAmount(value);
    }
  };

  const handleCancel = () => {
    setAmount('0');
    setSelectedToken('STRK');
  };

  const handleDeposit = () => {
    addDeposit({
      amount,
      tokenSymbol: selectedToken,
    }, {
      onSuccess: () => {
        setAmount('0');
        setSelectedToken('STRK');
      },
    });
  };

  return (
    <div className="deposit-wrapper">
      <div className="deposit-container">
        <h1 className="deposit-title1">zkLend Deposit</h1>
        <div className="main-container-deposit">
          <div className="top-cards-deposit">
            <Card label="Health Factor" value="1.47570678" icon={<HealthIcon className="icon" />} />
            <Card label="Borrow Balance" value="$-55.832665" icon={<EthIcon className="icon" />} />
          </div>
        </div>
        <h1 className="deposit-title2">Pls make a deposit</h1>
        <div className="token-selection-container">
          <label className="token-select-label">Select token</label>
          <TokenSelector
            selectedToken={selectedToken}
            setSelectedToken={setSelectedToken}
          />
        </div>

        <div className="amount-input-deposit" aria-labelledby="amount-input-label">
          <input
            type="text"
            id="amount-field"
            value={amount}
            onChange={handleAmountChange}
            pattern="^\d*\.?\d*$"
            className="amount-field-deposit"
            aria-describedby="currency-symbol"
            placeholder="0.00"
            disabled={isLoading}
          />
          <span id="currency-symbol" className="currency-deposit">
            {selectedToken}
          </span>
        </div>

        <div className='dep-button'>
          <button 
            className="deposit-cancel-button" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className="deposit-button" 
            onClick={handleDeposit}
            disabled={isLoading || amount === '0'}
          >
            {isLoading ? 'Processing...' : 'Deposit'}
          </button>
        </div>
      </div>
    </div>
  );
}
