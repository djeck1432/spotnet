import React, { useEffect, useState } from 'react';
import { useMatchMedia } from 'hooks/useMatchMedia';
import { getBalances } from '../../../services/wallet';
import { useWalletStore } from 'stores/useWalletStore';
import { ReactComponent as ETH } from '../../../assets/icons/ethereum.svg';
import { ReactComponent as USDC } from '../../../assets/icons/borrow_usdc.svg';
import { ReactComponent as STRK } from '../../../assets/icons/strk.svg';

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
    <div className={`mt-5 ${className}`}>
      <div className="flex flex-wrap justify-between gap-3 overflow-x-auto scrollbar-none md:flex-nowrap">
        {balances.map((balance) =>
          isMobile ? (
            <div
              className="flex flex-col flex-1 items-center justify-center rounded-lg border border-bg-footer-divider-bg bg-dark-purple py-3.5 sm:gap-1"
              key={balance.title}
            >
              <div className="flex w-max items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-dark-purple-light text-secondary">
                  {balance.icon}
                </span>
                <span className="text-sm text-secondary">{balance.title} Balance</span>
              </div>
              <span className="text-lg font-semibold text-secondary">{balance.balance}</span>
            </div>
          ) : (
            <div
              className="flex flex-col flex-1 items-center justify-center rounded-lg border border-bg-footer-divider-bg bg-dark-purple p-6 sm:gap-2"
              key={balance.title}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[hsla(261, 49%, 15%, 1)] text-secondary filter-grayscale">
                  {balance.icon}
                </span>
                <span className="text-sm text-secondary">{balance.title} Balance</span>
              </div>
              <span className="text-2xl font-semibold text-secondary">{balance.balance}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BalanceCards;
