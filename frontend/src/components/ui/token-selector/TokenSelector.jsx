import React from 'react';
import ETH from '@/assets/icons/ethereum.svg?react';
import USDC from '@/assets/icons/borrow_usdc.svg?react';
import STRK from '@/assets/icons/strk.svg?react';
import KSTRK from '@/assets/icons/kstrk.svg?react';


const Tokens = [
  { id: 'ethOption', component: <ETH />, label: 'ETH' },
  { id: 'usdcOption', component: <USDC />, label: 'USDC' },
  { id: 'strkOption', component: <STRK />, label: 'STRK' },
  { id: 'KstrkOption', component: <KSTRK />, label: 'KSTRK' },
];

const TokenSelector = ({ selectedToken, setSelectedToken, className }) => {
  const handleTokenChange = (token) => {
    setSelectedToken(token.label);
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <span className="block w-full text-stormy-gray text-start">Select Token</span>
      <div className="flex items-center justify-center w-full gap-2">
        {Tokens.map((token) => (
          <div
            className={`border-border-color relative grid h-16 w-full place-content-center rounded-xl border text-center cursor-pointer ${selectedToken === token.label ? "after:content[''] after:from-nav-button-hover after:to-pink after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:p-0.5 after:[mask:conic-gradient(#000_0_0)_content-box_exclude,conic-gradient(#000_0_0)]" : ''}`}
            key={token.id}
            onClick={() => handleTokenChange(token)}
          >
            <input
              type="radio"
              id={token.id}
              checked={selectedToken === token.label}
              name="token-options"
              value={token.label}
              onChange={() => handleTokenChange(token)}
              className="hidden w-full rounded-xs p-0.5 outline-none"
            />
            <div className="flex items-center w-full gap-1 py-4">
              <div className="grid w-8 h-8 rounded-full bg-border-color place-content-center">
                <span className="flex items-center justify-center w-5 h-5 rounded-full">{token.component}</span>
              </div>
              <label htmlFor={token.id} className="text-base font-semibold leading-6 text-primary">
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
