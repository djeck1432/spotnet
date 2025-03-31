import { useState } from 'react';
import DashboardTabs from '@/components/dashboard/dashboard-tab/DashboardTabs';
import Collateral from '@/components/dashboard/collateral/Collateral';
import Borrow from '@/components/dashboard/borrow/Borrow';
import Deposited from '@/components/dashboard/deposited/Deposited';
import { DASHBOARD_TABS } from '@/utils/constants';

export default function DashboardInfoCard({ cardData, startSum, currentSum, depositedData }) {
  const [activeTab, setActiveTab] = useState(DASHBOARD_TABS.COLLATERAL);
  const { COLLATERAL, BORROW, DEPOSITED } = DASHBOARD_TABS;

  return (
    <div className="flex h-[318px] w-full max-w-[642px] flex-col gap-4 rounded-lg border-1 border-[#36294e] bg-transparent px-6 py-4">
      <DashboardTabs activeTab={activeTab} switchTab={setActiveTab} />

      {activeTab === COLLATERAL && <Collateral startSum={startSum} currentSum={currentSum} data={cardData} />}

      {activeTab === BORROW && <Borrow data={cardData} />}

      {activeTab === DEPOSITED && <Deposited data={depositedData} />}
    </div>
  );
}
