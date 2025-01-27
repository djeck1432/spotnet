import React from 'react';
import './borrow.css';
import { ReactComponent as BorrowIcon } from 'assets/icons/borrow_dynamic.svg';

function Borrow({ data }) {
  return (
    <div className="borrow-tab-content">
      <div className="balance-info">
        <div className="currency-info">
          {React.createElement(data[1]?.currencyIcon || BorrowIcon, {
            className: 'icon',
          })}
          <span className="currency-name">{data[1]?.currencyName || 'N/A'}</span>
        </div>
        <span>
          <span className="balance-label">Balance: </span>
          <span className="balance-value">{data[1]?.balance ? Number(data[1].balance).toFixed(8) : '0.00'}</span>
        </span>
      </div>
    </div>
  );
}

export default Borrow;
