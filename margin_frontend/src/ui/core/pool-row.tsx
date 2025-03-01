import * as React from "react";

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

interface PoolRowProps {
  pool: PoolType;
}

export function PoolRow({ pool }: PoolRowProps) {
  return (
    <tr>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="font-medium">{pool.name}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-gray-400">
        {pool.type}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-green-500">
        {pool.totalApy}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {pool.liquidity}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-gray-400">
        {pool.riskLevel}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <button className="bg-[#1b1b1b] hover:bg-[#252525] transition-colors px-4 py-2 rounded text-sm">
          DEPOSIT
        </button>
      </td>
    </tr>
  );
}
