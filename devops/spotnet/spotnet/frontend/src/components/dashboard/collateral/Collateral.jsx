import React from 'react';
import CollateralIcon from '@/assets/icons/collateral_dynamic.svg?react';
import { TrendingDown, TrendingUp } from 'lucide-react';

function Collateral({ data, startSum, currentSum }) {
  const getCurrentSumColor = () => {
    if (currentSum > startSum) return 'text-profit-indicator';
    if (currentSum < startSum) return 'text-loss-indicator';
    return '';
  };

  return (
    <div className="h-fit w-full text-left text-base font-normal">
      <div className="flex h-fit w-fit flex-col gap-2 text-base">
        <div className="mb-1 flex items-center">
          {React.createElement(data[0]?.currencyIcon || CollateralIcon, {
            className: 'size-5 md:size-8 mr-2 bg-border-color rounded-full flex items-center justify-center p-1 md:p-2',
          })}

          <span className="text-secondary md:text-lg">{data[0]?.currencyName || 'N/A'}</span>
        </div>
        <span>
          <span className="font-normal text-gray-500">Balance: </span>
          <span className="text-secondary ml-1">{data[0]?.balance ? Number(data[0].balance).toFixed(8) : '0.00'}</span>
        </span>
        <span>
          <span className="font-normal text-gray-500">Start sum: </span>
          <span className="text-secondary ml-1">
            <span className="mr-1">$</span>
            {startSum ? Number(startSum).toFixed(2) : '0.00'}
          </span>
        </span>
        <span className="flex">
          <span className="mr-2 font-normal text-gray-500">Current sum: </span>
          <span className={`flex ${currentSum > 0 ? 'text-profit-indicator' : getCurrentSumColor()}`}>
            <span>$</span>
            {currentSum ? Number(currentSum).toFixed(8) : '0.00'}
            {currentSum > startSum && currentSum !== 0 && <TrendingUp className="text-profit-indicator ml-2 h-6 w-6" />}
            {currentSum < startSum && currentSum !== 0 && <TrendingDown className="text-loss-indicator ml-2 h-6 w-6" />}
          </span>
        </span>
      </div>
    </div>
  );
}

export default Collateral;
