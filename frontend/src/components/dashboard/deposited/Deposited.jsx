import { ReactComponent as EthIcon } from '../../../assets/icons/ethereum.svg';
import { ReactComponent as StrkIcon } from '../../../assets/icons/strk.svg';
import { ReactComponent as UsdIcon } from '../../../assets/icons/usdc-icon.svg';

function Deposited({ data }) {
  return (
    <div className="text-left w-full h-[190px] px-5 md:px-10 mt-4">
      <div className="flex flex-col gap-2.5 justify-center">
        <div className="flex items-center justify-between text-xl font-semibold">
          <div className="flex items-center gap-1.5 text-warning">
            <EthIcon className="w-8 h-8 bg-borderColor rounded-full p-1.5" />
            <p>ETH</p>
          </div>
          <p className="text-gray-500">{data.eth}</p>
        </div>

        <div className="h-0.5 w-full bg-borderColor rounded-lg my-2" />

        <div className="flex items-center justify-between text-xl font-semibold">
          <div className="flex items-center gap-1.5 text-warning">
            <StrkIcon className="w-8 h-8 bg-borderColor rounded-full p-1.5" />
            <p className="text-xl font-semibold">STRK</p>
          </div>
          <p className="text-gray-500">{data.strk}</p>
        </div>

        <div className="h-0.5 w-full bg-borderColor rounded-lg my-2" />

        <div className="flex items-center justify-between text-xl font-semibold">
          <div className="flex items-center gap-1.5 text-warning">
            <UsdIcon className="w-8 h-8 bg-borderColor rounded-full p-1.5" />
            <p className="text-xl font-semibold">USDC</p>
          </div>
          <p className="text-gray-500">{data.usdc}</p>
        </div>

        <div className="h-0.5 w-full bg-borderColor rounded-lg my-2" />

        <div className="flex items-center justify-between text-xl font-semibold">
          <div className="flex items-center gap-1.5 text-warning">
            <EthIcon className="w-8 h-8 bg-borderColor rounded-full p-1.5" />
            <p className="text-xl font-semibold">USDT</p>
          </div>
          <p className="text-gray-500">{data.usdt}</p>
        </div>
      </div>
    </div>
  );
}

export default Deposited;
