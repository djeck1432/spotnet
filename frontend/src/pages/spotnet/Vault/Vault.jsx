import React, { useEffect } from 'react';
import './vault.css';
import { ReactComponent as EthIcon } from 'assets/icons/ethereum.svg';
import { ReactComponent as HealthIcon } from 'assets/icons/health.svg';
import TableOfContents from './TableOfContents';

export default function Component() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tableOfContents = [
    { title: 'Home', link: 'home' },
    { title: 'Stake', link: 'stake' },
    { title: 'Withdraw', link: 'withdraw' },
  ];

  return (
    <div className="documentation-page">
      <TableOfContents items={tableOfContents} />

      <div className="page-wrapper">
        <div className="page-container">
          <div className="main-container">
            <div className="top-cards">
              <div className="card">
                <div className="card-header">
                  <HealthIcon className="icon" />
                  <span className="label">STRK Balance</span>
                </div>
                <div className="card-value">
                  <span className="top-card-value">{'0.046731'}</span>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <EthIcon className="icon" />
                  <span className="label">APY Balance</span>
                </div>
                <div className="card-value">
                  <span className="top-card-value">{'0.046731'}</span>
                </div>
              </div>
            </div>
            <div>Please submit your leverage details</div>

            <div className="main-card"></div>

            <button className="telegram-button">Stake</button>
          </div>
        </div>
      </div>
    </div>
  );
}
