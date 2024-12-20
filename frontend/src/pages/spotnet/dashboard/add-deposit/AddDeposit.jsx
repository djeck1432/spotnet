
import React, { useState } from 'react';
import Card from 'components/Card/Card';
import TokenSelectorDeposit from 'components/TokenSelector/TokenSelector';
import { ReactComponent as HealthIcon } from 'assets/icons/health.svg';
import { ReactComponent as EthIcon } from 'assets/icons/ethereum.svg';
import './AddDeposit.css';

export default function AddDeposit() {

  const [amount, setAmount] = useState('0');
  const handleAmountChange = (e) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value)) {
      setAmount(value);
    }
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
        <div className="">
          <label className="token-select-dep">Select token</label>
          <TokenSelectorDeposit />

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
          />
          <span id="currency-symbol" className="currency-deposit">
            STRK
          </span>
        </div>

        <div className='dep-button'>
          <button className=" deposit-cancel-button ">Cancel</button>
          <button className=" deposit-button ">Deposit</button>
        </div>


      </div>
    </div>
  )
}
