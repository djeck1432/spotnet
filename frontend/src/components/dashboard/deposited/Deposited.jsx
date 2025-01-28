import EthIcon from '@/assets/icons/ethereum.svg?react';
import StrkIcon from '@/assets/icons/strk.svg?react';
import UsdIcon from '@/assets/icons/usdc-icon.svg?react';

function Deposited({ data }) {
  return (
    <div className="text-left w-full h-[190px] px-5 md:px-10 mt-4">
      <div className="flex flex-col gap-2 justify-center">
        <div className="flex items-center justify-between text-xl font-semibold">
          <div className="flex items-center gap-1.5 text-white">
            <EthIcon className="w-8 h-8 bg-border-color rounded-full p-1.5" />
            <p>ETH</p>
          </div>
          <p className="text-gray">{data.eth}</p>
        </div>

        <div className="h-0.5 w-full bg-border-color rounded-lg my-0.5" />

        <div className="flex items-center justify-between text-xl font-semibold">
          <div className="flex items-center gap-1.5 text-white">
            <StrkIcon className="w-8 h-8 bg-border-color rounded-full p-1.5" />
            <p className="text-xl font-semibold">STRK</p>
          </div>
          <p className="text-gray">{data.strk}</p>
        </div>

        <div className="h-0.5 w-full bg-border-color rounded-lg my-0.5" />

        <div className="flex items-center justify-between text-xl font-semibold">
          <div className="flex items-center gap-1.5 text-white">
            <UsdIcon className="w-8 h-8 bg-border-color rounded-full p-1.5" />
            <p className="text-xl font-semibold">USDC</p>
          </div>
          <p className="text-gray">{data.usdc}</p>
        </div>

        <div className="h-0.5 w-full bg-border-color rounded-lg my-0.5" />

        <div className="flex items-center justify-between text-xl font-semibold">
          <div className="flex items-center gap-1.5 text-white">
            <EthIcon className="w-8 h-8 bg-border-color rounded-full p-1.5" />
            <p className="text-xl font-semibold">USDT</p>
          </div>
          <p className="text-gray">{data.usdt}</p>
        </div>
      </div>
    </div>
  );
}

export default Deposited;
