import React from 'react';
import Sidebar from 'components/layout/sidebar/Sidebar';
import clockIcon from 'assets/icons/clock.svg';
import computerIcon from 'assets/icons/computer-icon.svg';
import depositIcon from 'assets/icons/deposit.svg';
import withdrawIcon from 'assets/icons/withdraw.svg';

const dashboardItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    link: '/dashboard',
    icon: computerIcon,
  },
  {
    id: 'position_history',
    name: 'Position History',
    link: '/dashboard/position-history',
    icon: clockIcon,
  },
  {
    id: 'deposit',
    name: 'Add Deposit',
    link: '/dashboard/deposit',
    icon: depositIcon,
  },
  {
    id: 'withdraw',
    name: 'Withdraw All',
    link: '/dashboard/withdraw',
    icon: withdrawIcon,
  },
];

export default function DashboardLayout({ children, title = 'zkLend Position' }) {
  return (
    <div className="min-h-screen flex w-[calc(100vw-372px)] ml-[372px] lg:w-full lg:ml-0 lg:justify-center">
      <Sidebar items={dashboardItems} />
      <div className="relative flex justify-center items-center w-[calc(100vw-735px)] h-full">
        <div className="flex flex-col justify-center gap-2.5 px-6 pt-5 my-24 h-full">
          <h1 className="text-2xl font-semibold text-center text-white">
            {title}
          </h1>
          <div className="flex flex-col items-center justify-center gap-6 p-4 w-full rounded-xl text-secondary text-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}