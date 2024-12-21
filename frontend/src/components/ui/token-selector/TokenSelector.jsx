import React from 'react';
import { ReactComponent as ETH } from 'assets/icons/ethereum.svg';
import { ReactComponent as USDC } from 'assets/icons/borrow_usdc.svg';
import { ReactComponent as STRK } from 'assets/icons/strk.svg';

const Tokens = [
  { id: 'ethOption', component: <ETH />, label: 'ETH' },
  { id: 'usdcOption', component: <USDC />, label: 'USDC' },
  { id: 'strkOption', component: <STRK />, label: 'STRK' },
];

const TokenSelector = ({ selectedToken, setSelectedToken }) => {
  return (
    <div className="form-token">
      {Tokens.map((token) => (
        <div className="token-card" key={token?.id}>
          <div className="token-container">
            <input
              type="radio"
              id={token.id}
              checked={selectedToken === token.label}
              name="token-options"
              value={token.label}
              onChange={() => setSelectedToken(token?.label)}
            />
            <label htmlFor={token?.id}>
              <h5>
                <span className="token-icon">{token?.component}</span> {token?.label}
              </h5>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TokenSelector;
