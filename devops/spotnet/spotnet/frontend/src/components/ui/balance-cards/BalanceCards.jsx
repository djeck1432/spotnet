import React, { useEffect, useState } from 'react';
import { useMatchMedia } from '@/hooks/useMatchMedia';
import { getBalances } from '@/services/wallet';
import { useWalletStore } from '@/stores/useWalletStore';

import ETH from '@/assets/icons/ethereum.svg?react';
import USDC from '@/assets/icons/borrow_usdc.svg?react';
import STRK from '@/assets/icons/strk.svg?react';
import KSTRK from '@/assets/icons/kstrk.svg?react';

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
    { icon: <KSTRK />, title: 'kSTRK', balance: '0.00' },
  ]);

  return (
    <div className="no-scrollbar mx-auto mt-3 w-full max-w-2xl overflow-x-auto px-3">
      <div className="grid w-full min-w-md grid-cols-4 gap-4 rounded-[8px]">
        {balances.map((balance) =>
          isMobile ? (
            <div
              className="border- border-nav-divider-bg flex flex-col items-center rounded-xl border px-1 py-3 text-center"
              key={balance.title}
            >
              <label htmlFor={balance.title} className={'flex items-center gap-1 text-[#83919F]'}>
                <div className="bg-border-color flex h-6 w-6 justify-center rounded-full p-1">
                  <span className="flex h-full w-full items-center justify-center rounded-full">{balance.icon}</span>
                </div>
                <span className="text-sm">{balance.title} Balance</span>
              </label>
              <label htmlFor={balance.title}>
                <span className="text-2xl font-semibold text-white">{balance.balance}</span>
              </label>
            </div>
          ) : (
            <div
              className="border- border-nav-divider-bg flex flex-col items-center rounded-xl border px-3 py-4 text-center"
              key={balance.title}
            >
              <label htmlFor={balance.title} className={'flex gap-1 text-[#83919F]'}>
                <div className="bg-border-color flex h-6 w-6 justify-center rounded-full p-1">
                  <span className="flex h-full w-full items-center justify-center rounded-full">{balance.icon}</span>
                </div>
                <span className="text-sm">{balance.title} Balance</span>
              </label>
              <label htmlFor={balance.title}>
                <span className="text-2xl font-semibold text-white">{balance.balance}</span>
              </label>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BalanceCards;
