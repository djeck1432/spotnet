import React from "react";

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

interface PoolCardProps {
  pool: PoolType;
}

export default function PoolCard({ pool }: PoolCardProps) {
  return (
    <div className="bg-[#131313] rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{pool.name}</h2>
          <p className="text-sm text-[#898989]">
            {pool.type} · Base APY: {pool.baseApy}
          </p>
        </div>
        {pool.isDegen && (
          <span className="bg-[#1d1d1d] text-xs text-[#898989] px-2 py-1 rounded">
            Degen
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-[#898989] mb-1">Liquidity</p>
          <p className="font-medium">{pool.liquidity}</p>
        </div>
        <div>
          <p className="text-xs text-[#898989] mb-1">APY</p>
          <p className="font-medium text-[#58c15d]">{pool.totalApy}</p>
        </div>
        <div>
          <p className="text-xs text-[#898989] mb-1">Risk Level</p>
          <p className="font-medium">{pool.riskLevel}</p>
        </div>
      </div>

      <button className="w-full py-3 bg-[#1b1b1b] hover:bg-[#252525] rounded text-sm transition-colors">
        DEPOSIT
      </button>
    </div>
  );
}
