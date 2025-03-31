import React from 'react';
import DepositIcon from '@/assets/icons/deposited_dynamic.svg?react';
import CollateralIcon from '@/assets/icons/collateral_dynamic.svg?react';
import BorrowIcon from '@/assets/icons/borrow_dynamic.svg?react';
import { DASHBOARD_TABS } from '@/utils/constants';
import { cn } from '@/utils/cn';

function DashboardTabs({ activeTab, switchTab }) {
  const { COLLATERAL, BORROW, DEPOSITED } = DASHBOARD_TABS;

  const tabConfig = [
    {
      key: COLLATERAL,
      Icon: CollateralIcon,
      title: 'Collateral & Earnings',
      indicatorClass: 'w-[180px] left-0',
    },
    {
      key: BORROW,
      Icon: BorrowIcon,
      title: 'Borrow',
      indicatorClass: 'w-[155px] left-[38%]',
    },
    {
      key: DEPOSITED,
      Icon: DepositIcon,
      title: 'Deposited',
      indicatorClass: 'w-[155px] left-[78%]',
    },
  ];

  return (
    <div className="no-scrollbar relative flex items-center justify-between overflow-x-auto overflow-y-hidden border-b border-[#36294e] pb-1.5">
      {tabConfig.map((tab, index) => (
        <React.Fragment key={tab.key}>
          <button
            type="button"
            onClick={() => switchTab(tab.key)}
            className={cn(
              'flex flex-1 cursor-pointer items-center justify-center border-none bg-transparent py-2 text-center',
              activeTab === tab.key ? 'text-brand' : 'text-gray'
            )}
          >
            <tab.Icon className="mr-1 size-5" />
            <span className="text-sm font-semibold whitespace-nowrap md:text-[14px]">{tab.title}</span>
          </button>

          {index < tabConfig.length - 1 && (
            <div className="bg-border-color mx-4 min-h-4 min-w-[3px] rounded-lg md:h-2" />
          )}
        </React.Fragment>
      ))}

      <div className="bg-light-purple absolute -bottom-4 left-0 h-px w-[calc(100%-20px)] overflow-hidden md:-bottom-3 md:w-[calc(100%-16px)]">
        {tabConfig.map(
          (tab) =>
            activeTab === tab.key && (
              <div
                key={tab.key}
                className={cn(
                  'bg-brand absolute bottom-0 h-full transition-transform duration-300 ease-in-out',
                  tab.indicatorClass
                )}
              />
            )
        )}
      </div>
    </div>
  );
}

export default DashboardTabs;
