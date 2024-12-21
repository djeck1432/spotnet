import React from 'react';
import './withdraw.css';
import { ReactComponent as DiamondIcon } from '../../assets/icons/diamond.svg';
import { ReactComponent as TimeIcon } from '../../assets/icons/time.svg';
import { ReactComponent as SettingIcon } from '../../assets/icons/settings.svg';
import MetricCard from '../../components/vault/metric-card/MetricCard';
import { VaultLayout } from '../../components/vault/VaultLayout';

export default function Withdraw() {
  return (
    <VaultLayout>
    <div className="withdraw-wrapper">
      <div className="withdraw-container">
       <h1 className="withdrawal-title">zkLend Withdraw</h1>
        <div className="main-container-withdraw">
          <div className="top-cards-withdraw">
            <MetricCard title="Total Amount staked" value="324,909,894" />
            <MetricCard title="Daily Boost Multiplier" value="0.5%" />
          </div>
        </div>
        <h1 className="withdraw-title">Stake withdrawal</h1>
        <div className="main-card-withdraw">
          <div className="amount-stack-card">
            <div className="amount-stack-card-title-container">
              <div className="card-header">
                <DiamondIcon className="card-icon" />
                <span className="label">Your Stack</span>
              </div>
              <div className="card-value">
                <span className="top-card-value">13.89</span>
              </div>
            </div>
            <div className="amount-stack-card-title-container">
              <div className="card-header">
                <TimeIcon className="card-icon" />
                <span className="label">Your Boost</span>
              </div>
              <div className="card-value">
                <span className="top-card-value">132.43%</span>
              </div>
            </div>
          </div>
          <div className="withdraw-input-container">
            <div className="withdraw-input-title">Input Unstake Amount</div>
            <input type="text" className="withdraw-input" placeholder="Enter Amount to Withdraw" />
          </div>
          <div className="main-card-footer">
            <div className="divider"></div>
            <div className="settings-fee-container">
              <div className="setting-circle">
                <SettingIcon className="setting-icon" />
              </div>
              <div className="fee-title">Gas fee: 0.00 STRK</div>
            </div>
          </div>
        </div>
          <button className="withdraw-button larger-screen-btn">Withdraw</button>
         <div className='mobile-screen-btns'>
            <button className=" withdraw-button btn">Withdraw</button>
            <button className=" cancel-button btn">Cancel</button>
         </div>
      </div>
    </div>
    </VaultLayout>
  );
}