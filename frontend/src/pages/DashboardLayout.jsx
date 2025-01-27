import React from 'react';
import Sidebar from 'components/layout/sidebar/Sidebar';
import './DashboardLayout.css';

import clockIcon from 'assets/icons/clock.svg';
import computerIcon from 'assets/icons/computer-icon.svg';
import depositIcon from 'assets/icons/deposit.svg';
import withdrawIcon from 'assets/icons/withdraw.svg'



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
  }
];

export default function DashboardLayout({ children, title = 'zkLend Position' }) {
  return (
    <div className="dashboard">
      <Sidebar items={dashboardItems} />
      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          <h1 className="dashboard-title">{title}</h1>
          <div className="dashboard-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}