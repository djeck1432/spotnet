import React, { useEffect, useState } from 'react';
import { useMatchMedia } from 'hooks/useMatchMedia';
import { getBalances } from '../../../services/wallet';
import { useWalletStore } from 'stores/useWalletStore';
import { ReactComponent as ETH } from '../../../assets/icons/ethereum.svg';
import { ReactComponent as USDC } from '../../../assets/icons/borrow_usdc.svg';
import { ReactComponent as STRK } from '../../../assets/icons/strk.svg';
import './balanceCards.css';

const BalanceCards = ({ className }) => {
  const { walletId } = useWalletStore();

  const isMobile = useMatchMedia('(max-width: 768px)');

  useEffect(() => {
    getBalances(walletId, setBalances);
  }, [walletId]);

  const [balances, setBalances] = useState([
    { icon: <ETH />, title: 'ETH', balance: '0.00' },
    { icon: <USDC />, title: 'USDC', balance: '0.00' },
    { icon: <STRK />, title: 'STRK', balance: '0.00' },
  ]);

  return (
    <div>
      <div className={` ${className} w-full mt-5`}>
        <div className="flex justify-between w-full gap-4">
          {balances.map((balance) =>
            isMobile ? (
              <div
                className="flex flex-col items-center w-[198px] h-auto rounded-lg border border-light-purple bg-dark-purple p-4"
                key={balance.title}
              >
                <div className="flex items-center justify-center w-auto">
                  <label htmlFor="icon" className="flex items-center text-base">
                    <span className="flex items-center justify-center text-xl rounded-full bg-[hsla(261,49%,15%,1)] mr-1">
                      {balance.icon}
                    </span>
                  </label>
                  <label htmlFor={balance.title} className="text-xl font-semibold">
                    <span className="text-secondary">{balance.title} Balance</span>
                  </label>
                </div>
                <label htmlFor={balance.title} className="text-sm text-secondary">
                  {balance.balance}
                </label>
              </div>
            ) : (
              <div
                className="flex flex-col items-center w-[198px] h-[101px] rounded-lg border-1 border-light-purple bg-dark-purple p-4"
                key={balance.title}
              >
                <div className="flex items-center gap-x-4">
                  <div className="w-4 h-4 text-lg">
                    <span> {balance.icon}</span>
                  </div>
                  <p className="text-secondary">{balance.title} Balance</p>
                </div>
                <p className="text-2xl font-semibold text-white">{balance.balance}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BalanceCards;
