import React from 'react';
import CollateralIcon from '@/assets/icons/collateral_dynamic.svg';
import { TrendingDown, TrendingUp } from 'lucide-react';

function Collateral({ data, startSum, currentSum, getCurrentSumColor }) {
  const icon = data[0]?.currencyIcon;
  return (
    <div className="font-normal text-left w-fit h-fit p-1 pl-5 pt-8">
      <div className="flex flex-col gap-2 w-fit h-fit">
        <div className="flex items-center">
          <p className="w-8 h-8 mr-2 bg-border-color rounded-full flex items-center justify-center p-2">
            <img src={icon || CollateralIcon} alt="icon" />
          </p>
          <span className="text-2xl text-second-primary">{data[0]?.currencyName || 'N/A'}</span>
        </div>
        <span>
          <span className="text-gray text-base font-normal">Position Balance: </span>
          <span className="text-second-primary ml-1">
            {data[0]?.balance ? Number(data[0].balance).toFixed(8) : '0.00'}
          </span>
        </span>
        <span>
          <span className="text-gray text-base font-normal">Start sum: </span>
          <span className="text-second-primary ml-1">
            <span className="mr-1">$</span>
            {startSum ? Number(startSum).toFixed(2) : '0.00'}
          </span>
        </span>
        <span>
          <span className="text-gray text-base font-normal">Current sum: </span>
          <span className={`${currentSum >= 0 ? 'text-second-primary' : getCurrentSumColor()} ml-1`}>
            <span className="mr-1">$</span>
            {currentSum ? Number(currentSum).toFixed(8) : '0.00'}
            {currentSum > startSum && currentSum !== 0 && <TrendingUp className="text-collateral-color w-6 h-6 ml-2" />}
            {currentSum < startSum && currentSum !== 0 && <TrendingDown className="text-borrow-color w-5 h-5 ml-2" />}
          </span>
        </span>
      </div>
    </div>
  );
}

export default Collateral;
