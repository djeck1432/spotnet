import React, { useState, useEffect } from 'react';  // Add useEffect
import { useMatchMedia } from 'hooks/useMatchMedia';
import { useAllTokenBalances } from '../../../services/wallet';
import { ReactComponent as ETH } from '../../../assets/icons/ethereum.svg';
import { ReactComponent as USDC } from '../../../assets/icons/borrow_usdc.svg';
import { ReactComponent as STRK } from '../../../assets/icons/strk.svg';
import './balanceCards.css';
import Spinner from '../spinner/Spinner';

const BalanceCards = ({ className }) => {
  const [loading, setLoading] = useState(true);
  const isMobile = useMatchMedia('(max-width: 768px)');
  const balanceData = useAllTokenBalances();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const balanceItems = [
    { icon: <ETH />, title: 'ETH' },
    { icon: <USDC />, title: 'USDC' },
    { icon: <STRK />, title: 'STRK' },
  ];

  return (
    <div className={`balance-card ${className}`}>
      {loading && (
        <Spinner loading={loading} />
      )}
        <div className="balance-container">
          {balanceItems.map((item, index) =>
            isMobile ? (
              <div className="balance-item" key={item.title}>
                <div className="title-container">
                  <label htmlFor="icon" className="balance-title">
                    <span className="token-icon">{item.icon}</span>
                  </label>
                  <label htmlFor={item.title}>
                    <span className="balance-text">{item.title} Balance</span>
                  </label>
                </div>
                <label htmlFor={item.title}>{balanceData[index]?.balance || '0.00'}</label>
              </div>
            ) : (
              <div className="balance-item" key={item.title}>
                <label htmlFor={item.title} className={'balance-title'}>
                  <span className="token-icon blend">{item.icon}</span>
                  <span className="balance-text">{item.title} Balance</span>
                </label>
                <label htmlFor={item.title}>
                  <span className="balance-amount">{balanceData[index]?.balance || '0.00'}</span>
                </label>
              </div>
            )
          )}
        </div>
    </div>
  );
};

export default BalanceCards;