import { useIsMobile } from "../hooks/use-mobile";

import PoolCard from "./pool-card";
import PoolHeader from "./pool-head";
interface Pool {
  id: number;
  type: string;
  liquidity: string;
  risk: string;
  pair: string;
  apy: string;
}

interface PoolTableProps {
  pools: Pool[];
}

export default function PoolTable({ pools }: PoolTableProps) {
  const IsMobile = useIsMobile();
  return (
    <div className="overflow-x-hidden">
      {IsMobile ? (
        <div className="lg:hidden space-y-4">
          {pools.map((pool) => (
            <PoolCard key={pool.id} pool={pool} />
          ))}
        </div>
      ) : (
        <table className="w-full  border-collapse mx-auto  table-fixed">
          <thead className="">
            <tr className="text-left text-tableHeads py-4">
              <th className="text-sm font-semibold pb-4 w-1/4 lg:w-1/3 pl-4">
                Pool
              </th>
              <th className="text-sm font-semibold pb-4 pl-6">APY %</th>
              <th className="text-sm font-semibold pb-4 pl-6 ">Risk Level</th>
              <th className="text-sm font-semibold pb-4 ">Liquidity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grayborder text-gray-300 border-grayborder border-solid border-1">
            {pools.map((pool) => (
              <tr key={pool.id} className="hover:bg-[#1a1a1a]">
                <td className="py-4">
                  <div className="flex items-center  pl-2">
                    <PoolHeader />
                    <div>
                      <td className=" py-4 whitespace-nowrap font-medium ">
                        {pool.pair}{" "}
                        <p className="text-xs pt-1 text-gray-600 flex gap-3">
                          Stable <span>0.500%</span>{" "}
                        </p>{" "}
                      </td>
                    </div>
                  </div>
                </td>
                <td
                  className={`px-6 py-4  whitespace-nowrap font-bold ${pool.apy.includes("~") ? "text-red-500" : "text-[#00D1FF]"}`}
                >
                  {pool.apy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {pool.risk === "Low" ? (
                    <span className="px-2 inline-flex  leading-5 font-semibold ">
                      {pool.risk}
                    </span>
                  ) : pool.risk === "High" ? (
                    <span className="px-2 inline-flex  leading-5 font-semibold  ">
                      {pool.risk}
                    </span>
                  ) : null}
                </td>
                <td className="py-4 text-riskandliquidity text-sm">
                  {pool.liquidity}
                </td>
                <td className="py-4">
                  <button className="bg-gray-800/50 border-grayborder hover:bg-[#333] text-gray-400 py-3 px-8 rounded-full text-sm font-semibold">
                    DEPOSIT
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
