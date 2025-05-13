import React from 'react';
import Sidebar from '@/components/layout/sidebar/Sidebar';
// import './DashboardLayout.css';
import clockIcon from '@/assets/icons/clock.svg';
import computerIcon from '@/assets/icons/computer-icon.svg';
import depositIcon from '@/assets/icons/deposit.svg';
import withdrawIcon from '@/assets/icons/withdraw.svg';
import formIcon from '@/assets/icons/form-icon.svg';
import { useCheckMobile } from '@/hooks/useCheckMobile';

const dashboardItems = [
  {
    id: 'Postion',
    name: 'Open Position',
    link: '/form',
    icon: formIcon,
  },
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
    name: 'Add Extra Deposit',
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
  const isMobile = useCheckMobile();
  console.log(formIcon)
  return (
    <div className="flex min-h-screen w-screen md:justify-center lg:ml-[372px] lg:w-[calc(100vw-372px)]">
      <Sidebar items={dashboardItems} />
      <div className="relative flex items-center justify-around w-full h-full">
        <div className="mt-24 mb-12 flex h-full w-full flex-col justify-center gap-2.5 p-6 pt-5 md:w-auto md:max-w-none">
          <h1 className="mt-4 text-2xl font-semibold text-center text-second-primary">{title}</h1>
          <div className="flex flex-col justify-center w-full gap-6 text-center text-second-primary rounded-2xl">
            {children}
          </div>
        </div>
        {!isMobile && <div></div>}
      </div>
    </div>
  );
}
