import EthIcon from '@/assets/icons/ethereum.svg?react';
import filterIcon from '@/assets/icons/filter-horizontal.svg';
import HealthIcon from '@/assets/icons/health.svg?react';
import StrkIcon from '@/assets/icons/strk.svg?react';
import UsdIcon from '@/assets/icons/usd_coin.svg?react';
import Card from '@/components/ui/card/Card';
import Spinner from '@/components/ui/spinner/Spinner';
import useDashboardData from '@/hooks/useDashboardData';
import { usePositionHistoryTable } from '@/hooks/usePositionHistory';
import PositionHistoryModal from '@/pages/position-history/PositionHistoryModal';
import PositionPagination from '@/pages/position-history/PositionPagination';
import { useEffect, useState } from 'react';
import DashboardLayout from '../DashboardLayout';

function PositionHistory() {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: tableData, isPending } = usePositionHistoryTable();
  const { data: cardData } = useDashboardData();

  const [filteredTableData, setFilteredTableData] = useState(tableData);
  const positionsOnPage = 10;

  const getFilteredData = (data, page, itemsPerPage) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  };

  useEffect(() => {
    if (!isPending && tableData) setFilteredTableData(getFilteredData(tableData, currentPage, positionsOnPage));
  }, [currentPage, isPending]);

  const tokenIconMap = {
    STRK: <img src={StrkIcon} alt="strk-icon" className="w-6 h-6 bg-border-color rounded-full p-1" />,
    USDC: <img src={UsdIcon} alt="usd-icon" className="w-6 h-6 bg-border-color rounded-full p-1" />,
    ETH: <img src={EthIcon} alt="eth-icon" className="w-6 h-6 bg-border-color rounded-full p-1" />,
  };

  const statusStyles = {
    opened: 'text-success-color',
    closed: 'text-error-color',
    pending: 'text-warning',
  };

  return (
    <DashboardLayout title="Position History">
      <div className="flex flex-col items-center gap-6">
        <div className="flex justify-center gap-4 w-full max-w-[642px]">
          <Card
            label="Health Factor"
            value={cardData?.health_ratio || '0.00'}
            icon={<img src={HealthIcon} alt="health-icon" className="w-6 h-6" />}
          />
          <Card
            label="Borrow Balance"
            value={cardData?.borrowed || '0.00'}
            icon={<img src={EthIcon} alt="eth-icon" className="w-6 h-6" />}
          />
        </div>

        <div className="w-full max-w-[1000px] mx-auto">
          <div className="text-white text-[16px] mb-4 pl-2">Position History</div>
          <div className="border-x border-y border-light-purple rounded-xl overflow-hidden mb-2">
            {isPending ? (
              <div className="flex justify-center py-4">
                <Spinner loading={isPending} />
              </div>
            ) : (
              <table className="w-full table-auto text-left text-sm text-secondary">
                <thead className="bg-[#120721] text-gray uppercase text-xs border-b border-light-purple px-2">
                  <tr>
                    <th className="py-4 px-2 pl-4">Token</th>
                    <th className="py-4 px-2">Amount</th>
                    <th className="py-4 px-2">Created At</th>
                    <th className="py-4 px-2">Status</th>
                    <th className="py-4 px-2">Start Price</th>
                    <th className="py-4 px-2">Multiplier</th>
                    <th className="py-4 px-2">Liquidated</th>
                    <th className="py-4 px-2">Closed At</th>
                    <th className="py-4 px-2 pr-4 w-10">
                      <img src={filterIcon} alt="filter-icon" className="cursor-pointer" />
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {!tableData || tableData?.length === 0 || !filteredTableData ? (
                    <tr>
                      <td colSpan="10" className="text-center py-4">No opened positions</td>
                    </tr>
                  ) : (
                    filteredTableData.map((data, index) => (
                      <tr key={data.id} className="even:bg-[#1c0f2a]">
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-2">
                            {tokenIconMap[data.token_symbol]}
                            <span className="text-primary font-medium">{data.token_symbol.toUpperCase()}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2">{data.amount}</td>
                        <td className="py-4 px-2">{data.created_at}</td>
                        <td className={`py-4 px-2 font-semibold ${statusStyles[data.status.toLowerCase()] || ''}`}>{data.status}</td>
                        <td className="py-4 px-2">{data.start_price}</td>
                        <td className="py-4 px-2">{data.multiplier}</td>
                        <td className="py-4 px-2">{data.is_liquidated}</td>
                        <td className="py-4 px-2">{data.closed_at}</td>
                        <td className="py-4 px-2 text-center">
                          <span
                            className="cursor-pointer text-primary hover:bg-opacity-10 p-1 rounded transition-all"
                            onClick={() => setSelectedPosition({ data, index })}
                          >
                            &#x22EE;
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <PositionPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isPending={isPending}
          tableData={tableData}
          positionsOnPage={positionsOnPage}
        />

        {selectedPosition && (
          <PositionHistoryModal
            position={selectedPosition.data}
            onClose={() => setSelectedPosition(null)}
            tokenIcon={tokenIconMap}
            statusStyles={statusStyles}
            index={selectedPosition.index + 1}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default PositionHistory;
