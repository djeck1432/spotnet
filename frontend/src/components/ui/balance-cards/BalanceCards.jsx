import React, { useState, useEffect } from 'react';
import { useMatchMedia } from 'hooks/useMatchMedia';
import {  useGetBalance } from '../../../services/wallet';
import { useAccountStore, useWalletStore } from 'stores/useWalletStore';
import { ReactComponent as ETH } from '../../../assets/icons/ethereum.svg';
import { ReactComponent as USDC } from '../../../assets/icons/borrow_usdc.svg';
import { ReactComponent as STRK } from '../../../assets/icons/strk.svg';
import './balanceCards.css';

const BalanceCards = ({ className }) => {
  const { walletId } = useWalletStore();
  const { account} = useAccountStore();
  const { getBalances } = useGetBalance();

  const isMobile = useMatchMedia('(max-width: 768px)');

  useEffect(() => {
    if (walletId && account) {
      getBalances(walletId, setBalances);
    }
  }, []);

  const [balances, setBalances] = useState([
    { icon: <ETH />, title: 'ETH', balance: '0.00' },
    { icon: <USDC />, title: 'USDC', balance: '0.00' },
    { icon: <STRK />, title: 'STRK', balance: '0.00' },
  ]);


  return (
    <div className={`balance-card ${className}`}>
      <div className="balance-container">
        {balances.map((balance) =>
          isMobile ? (
            <div className="balance-item" key={balance.title}>
              <div className="title-container">
                <label htmlFor="icon" className="balance-title">
                  <span className="token-icon">{balance.icon}</span>
                </label>
                <label htmlFor={balance.title}>
                  <span className="balance-text">{balance.title} Balance</span>
                </label>
              </div>
              <label htmlFor={balance.title}>{balance.balance}</label>
            </div>
          ) : (
            <div className="balance-item" key={balance.title}>
              <label htmlFor={balance.title} className={'balance-title'}>
                <span className="token-icon blend">{balance.icon}</span>
                <span className="balance-text">{balance.title} Balance</span>
              </label>
              <label htmlFor={balance.title}>
                <span className="balance-amount">{balance.balance}</span>
              </label>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BalanceCards;
