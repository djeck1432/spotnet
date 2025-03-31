import React from 'react';
import BorrowIcon from '@/assets/icons/borrow_dynamic.svg?react';

function Borrow({ data }) {
  return (
    <div className="h-fit w-fit p-1 pt-0 text-left text-base font-normal">
      <div className="mt-3 flex h-[190px] flex-col gap-2 max-[594px]:w-full">
        <div className="flex items-center">
          {React.createElement(data[1]?.currencyIcon || BorrowIcon, {
            className: 'w-8 h-8 mr-2 bg-border-color rounded-full flex items-center justify-center p-2',
          })}
          <span className="text-second-primary text-[20px]">{data[1]?.currencyName || 'N/A'}</span>
        </div>
        <span>
          <span className="text-gray text-base font-normal">Balance: </span>
          <span className="text-second-primary ml-1">
            {data[1]?.balance ? Number(data[1].balance).toFixed(8) : '0.00'}
          </span>
        </span>
      </div>
    </div>
  );
}

export default Borrow;
