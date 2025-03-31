import EthIcon from '@/assets/icons/ethereum.svg?react';
import StrkIcon from '@/assets/icons/strk.svg?react';
import KStrkIcon from '@/assets/icons/kstrk.svg?react';
import UsdIcon from '@/assets/icons/usdc-icon.svg?react';

const IconWrapper = ({ children }) => <div>{children}</div>;

function Deposited({ data }) {
  return (
    <div className="mt-4 h-[190px] w-full px-10 pr-10 text-left max-[480px]:p-0 md:mt-0 md:h-auto md:p-4">
      <div className="flex flex-col justify-center gap-2">
        <div className="flex items-center justify-between text-base font-semibold">
          <div className="text-warning-text-colour flex items-center gap-1">
            <EthIcon className="bg-border-color flex size-5 items-center justify-center rounded-[900px] p-1 md:size-8 md:p-2" />
            <p>ETH</p>
          </div>
          <p className="text-gray">{data.eth}</p>
        </div>

        <div className="bg-border-color h-[1px] w-full rounded-lg md:h-0.5" />

        <div className="flex items-center justify-between text-base font-semibold">
          <div className="text-warning-text-colour flex items-center gap-1">
            <StrkIcon className="bg-border-color flex size-5 items-center justify-center rounded-[900px] p-1 md:size-8 md:p-2" />
            <p>STRK</p>
          </div>
          <p className="text-gray">{data.strk}</p>
        </div>

        <div className="bg-border-color h-[1px] w-full rounded-lg md:h-0.5" />

        <div className="flex items-center justify-between text-base font-semibold">
          <div className="text-warning-text-colour flex items-center gap-1">
            <KStrkIcon className="bg-border-color flex size-5 items-center justify-center rounded-[900px] p-1 md:size-8 md:p-2" />
            <p>kSTRK</p>
          </div>
          <p className="text-gray">{data.kstrk}</p>
        </div>

        <div className="bg-border-color h-[1px] w-full rounded-lg md:h-0.5" />

        <div className="flex items-center justify-between text-base font-semibold">
          <div className="text-warning-text-colour flex items-center gap-1">
            <UsdIcon className="bg-border-color flex size-5 items-center justify-center rounded-[900px] p-1 md:size-8 md:p-2" />
            <p>USDC</p>
          </div>
          <p className="text-gray">{data.usdc}</p>
        </div>
      </div>
    </div>
  );
}

export default Deposited;
