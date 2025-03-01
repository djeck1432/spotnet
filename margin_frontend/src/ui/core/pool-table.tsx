import React from "react";
import strkLogo from "../../assets/img/strkLogo.png";
import ethLogo from "../../assets/img/ethLogo.png";

export interface PoolType {
  id: number;
  name: string;
  type: string;
  baseApy: string;
  totalApy: string;
  liquidity: string;
  riskLevel: string;
  isDegen: boolean;
}

interface PoolTableProps {
  pools: PoolType[];
}

export default function PoolTable({ pools }: PoolTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-[#131313] rounded-md">
        {/* TABLE HEADER */}
        <thead>
          <tr className="border-b border-[#252525]">
            <th className="px-6 py-4 text-left text-sm font-medium text-[#898989]">Pool</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-[#898989]">Type</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-[#898989]">APY</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-[#898989]">Liquidity</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-[#898989]">Risk Level</th>
            <th className="px-6 py-4" />
          </tr>
        </thead>

    
        <tbody>
          {pools.map((pool) => (
            <tr key={pool.id} className="border-b border-[#252525] last:border-0">
              
              <td className="px-6 py-4">
                <div className="flex items-center">
                
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <img
                        src={strkLogo}
                        alt="STRK"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-6 h-6 rounded-full overflow-hidden -ml-2">
                      <img
                        src={ethLogo}
                        alt="ETH"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                
                  <div className="ml-3">
                    <div className="text-sm font-medium">{pool.name}</div>
                    <div className="text-xs text-[#898989]">
                      {pool.type} {pool.baseApy}
                    </div>
                  </div>
                </div>
              </td>

              
              <td className="px-6 py-4 text-sm text-[#898989]">{pool.type}</td>

              
              <td className="px-6 py-4 text-sm text-[#58c15d]">{pool.totalApy}</td>

              
              <td className="px-6 py-4 text-sm">{pool.liquidity}</td>

        
              <td className="px-6 py-4 text-sm">{pool.riskLevel}</td>

            
              <td className="px-6 py-4">
                <button className="py-2 px-4 bg-[#1b1b1b] hover:bg-[#252525] rounded text-sm transition-colors">
                  DEPOSIT
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
