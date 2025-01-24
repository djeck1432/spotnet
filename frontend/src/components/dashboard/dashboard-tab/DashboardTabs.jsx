import './dashboardTabs.css';
import { ReactComponent as DepositIcon } from '../../../assets/icons/deposited_dynamic.svg';
import { ReactComponent as CollateralIcon } from '../../../assets/icons/collateral_dynamic.svg';
import { ReactComponent as BorrowIcon } from '../../../assets/icons/borrow_dynamic.svg';
import { DASHBOARD_TABS } from 'utils/constants';

function DashboardTabs({ activeTab, switchTab }) {
  const { COLLATERAL, BORROW, DEPOSITED } = DASHBOARD_TABS;

  return (
    <div className="tabs">
      <button onClick={() => switchTab(COLLATERAL)} className={`tab ${activeTab === COLLATERAL ? 'active' : ''}`}>
        <CollateralIcon className="tab-icon" />
        <span className="tab-title">Collateral & Earnings</span>
      </button>

      <div className="tab-divider" />

      <button onClick={() => switchTab(BORROW)} className={`tab ${activeTab === BORROW ? 'active' : ''}`}>
        <BorrowIcon className="tab-icon" />
        <span className="tab-title">Borrow</span>
      </button>

      <div className="tab-divider" />

      <button onClick={() => switchTab(DEPOSITED)} className={`tab ${activeTab === DEPOSITED ? 'active' : ''}`}>
        <DepositIcon className="tab-icon" />
        <span className="tab-title">Deposited</span>
      </button>

      <div className="tab-indicator-container">
        <div className={`tab-indicator ${activeTab}`} />
      </div>
    </div>
  );
}

export default DashboardTabs;
