import React from 'react';
import DepositIcon from '@/assets/icons/deposited_dynamic.svg?react';
import CollateralIcon from '@/assets/icons/collateral_dynamic.svg?react';
import BorrowIcon from '@/assets/icons/borrow_dynamic.svg?react';
import { DASHBOARD_TABS } from '@/utils/constants';

function DashboardTabs({ activeTab, switchTab }) {
  const { COLLATERAL, BORROW, DEPOSITED } = DASHBOARD_TABS;

  const tabConfig = [
    {
      key: COLLATERAL,
      Icon: CollateralIcon,
      title: 'Collateral & Earnings',
    },
    {
      key: BORROW,
      Icon: BorrowIcon,
      title: 'Borrow',
    },
    {
      key: DEPOSITED,
      Icon: DepositIcon,
      title: 'Deposited',
    },
  ];

  return (
    <div className="flex relative items-center pb-2 border-b border-light-purple mb-4">
      {tabConfig.map((tab, index) => (
        <React.Fragment key={tab.key}>
          <button
            type="button"
            onClick={() => switchTab(tab.key)}
            className={`flex-1 text-center py-2 cursor-pointer flex items-center justify-center ${activeTab === tab.key ? 'text-brand' : 'text-gray'}`}
          >
            <img src={tab.Icon} alt="icon" className="mr-2" />
            <span className="text-[15px] font-semibold">{tab.title}</span>
          </button>

          {index < tabConfig.length - 1 && <div className="w-[3px] h-[18px] rounded-lg bg-footer-divider-bg mx-3"></div>}
        </React.Fragment>
      ))}

      <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden">
        <div
          className={`absolute bottom-0 left-0 h-full transition-transform duration-300 ease-in-out transform ${
            activeTab === COLLATERAL
              ? 'w-[180px] bg-blue-pink-gradient-alt2'
              : activeTab === BORROW
              ? 'w-[155px] bg-blue-pink-gradient-alt2 left-[38%]'
              : activeTab === DEPOSITED
              ? 'w-[155px] bg-blue-pink-gradient-alt2 left-[78%]'
              : ''
          }`}
        />
      </div>
    </div>
  );
}

export default DashboardTabs;
