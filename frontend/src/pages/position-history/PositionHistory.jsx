import React, { useEffect, useState } from 'react';
import DashboardLayout from '../DashboardLayout';
import { ReactComponent as HealthIcon } from '../../assets/icons/health.svg';
import { ReactComponent as EthIcon } from '../../assets/icons/ethereum.svg';
import { ReactComponent as StrkIcon } from '../../assets/icons/strk.svg';
import { ReactComponent as UsdIcon } from '../../assets/icons/usd_coin.svg';
import { usePositionHistoryTable } from '../../hooks/usePositionHistory';
import Spinner from '../../components/ui/spinner/Spinner';
import filterIcon from '../../assets/icons/filter-horizontal.svg';
import useDashboardData from '../../hooks/useDashboardData';
import Card from '../../components/ui/card/Card';
import PositionHistoryModal from '../../pages/position-history/PositionHistoryModal';
import PositionPagination from '../../pages/position-history/PositionPagination';

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
    STRK: <StrkIcon className="w-6 h-6 bg-[#201338] rounded-full p-1" />,
    USDC: <UsdIcon className="w-6 h-6 bg-[#201338] rounded-full p-1" />,
    ETH: <EthIcon className="w-6 h-6 bg-[#201338] rounded-full p-1" />,
  };

  const statusStyles = {
    opened: 'text-green-500',
    closed: 'text-red-500',
    pending: 'text-yellow-500',
  };

  return (
    <DashboardLayout title="Position History">
      <div className="flex flex-col items-center gap-6">
        <div className="flex justify-center gap-4 w-full max-w-[642px]">
          <Card
            label="Health Factor"
            value={cardData?.health_ratio || '0.00'}
            icon={<HealthIcon className="w-6 h-6" />}
          />
          <Card
            label="Borrow Balance"
            cardData={cardData?.borrowed || '0.00'}
            icon={<EthIcon className="w-6 h-6" />}
          />
        </div>

        <div className="w-full max-w-[1000px] mx-auto">
          <div className="text-primary text-sm mb-4 pl-2">Position History</div>
          <div className="border border-[#201338] rounded-xl">
            {isPending ? (
              <div className="flex justify-center py-4">
                <Spinner loading={isPending} />
              </div>
            ) : (
              <table className="w-full table-separate text-white">
                <thead>
                  <tr>
                    <th></th>
                    <th>Token</th>
                    <th>Amount</th>
                    <th>Created At</th>
                    <th>Status</th>
                    <th>Start Price</th>
                    <th>Multiplier</th>
                    <th>Liquidated</th>
                    <th>Closed At</th>
                    <th className="w-10">
                      <img src={filterIcon} alt="filter-icon" className="cursor-pointer" />
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {!tableData || tableData.length === 0 || !filteredTableData ? (
                    <tr>
                      <td colSpan="10" className="text-center py-4">No opened positions</td>
                    </tr>
                  ) : (
                    filteredTableData.map((data, index) => (
                      <tr key={data.id} className="even:bg-[#120721]">
                        <td className="text-gray-500">{index + 1}.</td>
                        <td>
                          <div className="flex items-center justify-center gap-2">
                            {tokenIconMap[data.token_symbol]}
                            <span className="text-primary">{data.token_symbol.toUpperCase()}</span>
                          </div>
                        </td>
                        <td>{data.amount}</td>
                        <td>{data.created_at}</td>
                        <td className={`font-semibold ${statusStyles[data.status.toLowerCase()] || ''}`}>{data.status}</td>
                        <td>{data.start_price}</td>
                        <td>{data.multiplier}</td>
                        <td>{data.is_liquidated}</td>
                        <td>{data.closed_at}</td>
                        <td className="text-center">
                          <span className="cursor-pointer text-primary hover:bg-opacity-10 p-1 rounded transition-all" onClick={() => setSelectedPosition({ data, index })}>
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
