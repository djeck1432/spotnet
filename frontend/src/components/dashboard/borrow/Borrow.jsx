import React from 'react';
import BorrowIcon from '@/assets/icons/borrow_dynamic.svg';

function Borrow({ data }) {
  const icon = data[1]?.currencyIcon;
  return (
    <div className="font-normal text-left w-fit h-fit p-1 pt-0">
      <div className="flex flex-col gap-2 w-[594px] h-[190px] mt-3">
        <div className="flex items-center">
          <p className="w-8 h-8 mr-2 bg-border-color rounded-full flex items-center justify-center p-2">
            <img src={icon || BorrowIcon} alt="icon" />
          </p>

          <span className="text-2xl text-second-primary">{data[1]?.currencyName || 'N/A'}</span>
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
