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
import { useState } from 'react';
import DashboardLayout from '../DashboardLayout';

function PositionHistory() {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const positionsOnPage = 10;

  const { data: tableData, isPending } = usePositionHistoryTable(currentPage, positionsOnPage);
  const { data: cardData } = useDashboardData();

  const tokenIconMap = {
    STRK: <StrkIcon className="h-6 w-6 rounded-full bg-[#201338] p-1" />,
    USDC: <UsdIcon className="h-6 w-6 rounded-full bg-[#201338] p-1" />,
    ETH: <EthIcon className="h-6 w-6 rounded-full bg-[#201338] p-1" />,
  };

  const statusStyles = {
    opened: 'text-[#1EDC9E]',
    closed: 'text-[#433B5A]',
    pending: 'text-[#83919F]',
  };

  return (
    <DashboardLayout title="Position History">
      <div className="text-primary flex flex-col items-center justify-center gap-0.5 rounded-lg pt-6 text-center">
        <div className="flex w-full gap-2 min-[800px]:w-[600px]">
          <Card
            label="Health Factor"
            value={cardData?.health_ratio || '0.00'}
            icon={
              <HealthIcon className="bg-border-color mr-[5px] flex h-8 w-8 items-center justify-center rounded-full p-2" />
            }
          />
          <Card
            label="Borrow Balance"
            cardData={cardData?.borrowed || '0.00'}
            icon={
              <EthIcon className="bg-border-color mr-[5px] flex h-8 w-8 items-center justify-center rounded-full p-2" />
            }
          />
        </div>
      </div>
      <div className="mx-auto w-full">
        <div className="mb-4 pl-2 text-sm text-white">
          <p>Position History</p>
        </div>

        <div className="overflow-auto rounded-lg border border-[#36294E] max-[1300px]:max-w-[650px] max-[400px]:w-full [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#36294E] hover:[&::-webkit-scrollbar-thumb]:bg-[#4b3b69] [&::-webkit-scrollbar-track]:bg-[#12072180]">
          {isPending ? (
            <div className="flex items-center justify-center">
              <Spinner loading={isPending} />
            </div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-[#36294E] text-[clamp(0.8rem,2vw,1rem)] font-normal whitespace-nowrap text-[#9CA3AF]">
                  <th className="w-[5%] px-4 py-4 text-left text-sm font-normal">#</th>
                  <th className="w-[12%] px-4 py-4 text-left text-sm font-normal">Token</th>
                  <th className="w-[8%] px-4 py-4 text-center text-sm font-normal">Amount</th>
                  <th className="hidden w-[15%] px-4 py-4 text-center text-sm font-normal lg:table-cell">Created At</th>
                  <th className="w-[10%] px-4 py-4 text-center text-sm font-normal">Status</th>
                  <th className="hidden w-[12%] px-4 py-4 text-center text-sm font-normal lg:table-cell">
                    Start Price
                  </th>
                  <th className="hidden w-[10%] px-4 py-4 text-center text-sm font-normal lg:table-cell">Multiplier</th>
                  <th className="hidden w-[10%] px-4 py-4 text-center text-sm font-normal lg:table-cell">Liquidated</th>
                  <th className="hidden w-[15%] px-4 py-4 text-center text-sm font-normal lg:table-cell">Closed At</th>
                  <th className="w-[3%] px-4 py-4 text-center">
                    <img src={filterIcon} alt="filter-icon" draggable="false" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {!tableData?.positions || tableData?.positions?.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="py-4 text-center">
                      No opened positions
                    </td>
                  </tr>
                ) : (
                  tableData?.positions?.map((data, index) => (
                    <tr key={data.id} className="even:bg-[rgba(18,7,33,0.5)]">
                      <td className="px-4 py-4 text-left text-[#9CA3AF]">{index + 1}.</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {tokenIconMap[data.token_symbol]}
                          <span className="text-white">{data.token_symbol.toUpperCase()}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-white">{data.amount}</td>
                      <td className="hidden px-4 py-4 text-center text-white lg:table-cell">{data.created_at}</td>
                      <td className={`px-4 py-4 text-center font-semibold ${statusStyles[data.status.toLowerCase()]}`}>
                        {data.status}
                      </td>
                      <td className="hidden px-4 py-4 text-center text-white lg:table-cell">{data.start_price}</td>
                      <td className="hidden px-4 py-4 text-center text-white lg:table-cell">{data.multiplier}</td>
                      <td className="hidden px-4 py-4 text-center text-white lg:table-cell">
                        {data.is_liquidated.toString()}
                      </td>
                      <td className="hidden px-4 py-4 text-center text-white lg:table-cell">{data.closed_at}</td>
                      <td className="block px-4 py-4 text-center md:hidden">
                        <button
                          className="cursor-pointer rounded p-1 text-[#433B5A] transition-colors hover:bg-white/10 hover:text-[#fff]"
                          onClick={() => setSelectedPosition({ data, index })}
                        >
                          &#x22EE;
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {!tableData?.positions || tableData?.positions?.length === 0 ? null : (
        <PositionPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isPending={isPending}
          tableData={tableData}
          positionsOnPage={positionsOnPage}
        />
      )}

      {selectedPosition && (
        <PositionHistoryModal
          position={selectedPosition.data}
          onClose={() => setSelectedPosition(null)}
          tokenIcon={tokenIconMap}
          statusStyles={statusStyles}
          index={selectedPosition.index + 1}
        />
      )}
    </DashboardLayout>
  );
}

export default PositionHistory;
