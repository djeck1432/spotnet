import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/sidebar/Sidebar';

export function VaultLayout({ children }) {
  const vaultItems = [
    {
      id: 'home',
      name: 'Home',
      link: '/',
    },
    {
      id: 'stake',
      name: 'Stake',
      link: '/stake',
    },
    {
      id: 'withdraw',
      name: 'Withdraw',
      link: '/withdraw',
    },
  ];
  
  return (
    <div className="flex">
      <Sidebar title="Vault" items={vaultItems} />
      <main className="flex-1 p-8 relative w-full">
        {children}
        <Outlet />
      </main>
    </div>
  );
}
