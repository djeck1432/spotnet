import React from 'react';
import './dashboardTabs.css';
import { ReactComponent as DepositIcon } from '../../../assets/icons/deposited_dynamic.svg';
import { ReactComponent as CollateralIcon } from '../../../assets/icons/collateral_dynamic.svg';
import { ReactComponent as BorrowIcon } from '../../../assets/icons/borrow_dynamic.svg';
import { DASHBOARD_TABS } from 'utils/constants';

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
    <div className="tabs">
      {tabConfig.map((tab, index) => (
        <React.Fragment key={tab.key}>
          <button
            type="button"
            onClick={() => switchTab(tab.key)}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
          >
            <tab.Icon className="tab-icon" />
            <span className="tab-title">{tab.title}</span>
          </button>

          {index < tabConfig.length - 1 && <div className="tab-divider"></div>}
        </React.Fragment>
      ))}

      <div className="tab-indicator-container">
        <div className={`tab-indicator ${activeTab}`} />
      </div>
    </div>
  );
}

export default DashboardTabs;
