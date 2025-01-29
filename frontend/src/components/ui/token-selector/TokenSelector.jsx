import React from 'react';
import ETH from '@/assets/icons/ethereum.svg?react';
import USDC from '@/assets/icons/borrow_usdc.svg?react';
import STRK from '@/assets/icons/strk.svg?react';

const Tokens = [
  { id: 'ethOption', component: <img src={ETH} alt="icon" />, label: 'ETH' },
  { id: 'usdcOption', component: <img src={USDC} alt="icon" />, label: 'USDC' },
  { id: 'strkOption', component: <img src={STRK} alt="icon" />, label: 'STRK' },
];

const TokenSelector = ({ selectedToken, setSelectedToken, className }) => {
  const handleTokenChange = (token) => {
    setSelectedToken(token.label);
  };

  return (
    <div className={`flex flex-col gap-4 w-full ${className}`}>
      <span className="text-gray text-lg">Select Token</span>
      <div className="flex justify-center items-center gap-4 mt-2">
        {Tokens.map((token) => (
          <div
            key={token.id}
            className={`relative w-full text-center rounded-lg p-2 transition-colors duration-300 cursor-pointer ${
              selectedToken === token.label
                ? 'border-gradient-mask'
                : 'border-x border-y border-secondary'
            }`}
            onClick={() => handleTokenChange(token)}
          >
            <input
              type="radio"
              id={token.id}
              checked={selectedToken === token.label}
              name="token-options"
              value={token.label}
              onChange={() => handleTokenChange(token)}
              className="hidden"
            />
            <div className="flex flex-row gap-2 items-center justify-center py-2">
              <span className="h-8 w-8 flex justify-center items-center">
                {token.component}
              </span>
              <label
                htmlFor={token.id}
                className="text-lg font-semibold text-white"
              >
                {token.label}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenSelector;
