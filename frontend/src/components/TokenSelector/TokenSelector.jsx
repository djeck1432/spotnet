
import React from 'react';
import { ReactComponent as ETH } from 'assets/icons/ethereum.svg';
import { ReactComponent as USDC } from 'assets/icons/borrow_usdc.svg';
import { ReactComponent as STRK } from 'assets/icons/strk.svg';
import './TokenSelector.css';

const Tokens = [
  { id: 'ethOption', component: <ETH />, label: 'ETH' },
  { id: 'usdcOption', component: <USDC />, label: 'USDC' },
  { id: 'strkOption', component: <STRK />, label: 'STRK'},
];

const TokenSelector = ({ selectedToken, setSelectedToken, onSelect }) => {
  const handleTokenChange = (token) => {
    setSelectedToken(token.label);
    if (onSelect) {
      onSelect(token.label);
    }
  };

  return (
    <div className="token-deposit">
      {Tokens.map((token) => (
        <div className="token-card-btn" key={token.id}>
          <div className="token-container-deposit">
            <input
              type="radio"
              id={token.id}
              checked={selectedToken === token.label}
              name="token-options"
              value={token.label}
              onChange={() => handleTokenChange(token)}
            />
            <label htmlFor={token.id}>
              <h5>
                <span className="token-icon-deposit">{token.component}</span> 
                {token.label}
              </h5>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TokenSelector;
