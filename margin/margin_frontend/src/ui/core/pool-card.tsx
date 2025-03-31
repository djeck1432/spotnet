import { Button } from "./button";

interface PoolCardProps {
  pool: {
    id: number;

    apy: string;
    liquidity: string;
    risk: string;
    pair: string;
    type: string;
  };
}

export default function PoolCard({ pool }: PoolCardProps) {
  return (
    <div className="bg-[#090a08]  bricolage rounded-lg p-5 text-baseWhite">
      <div className="flex items-center justify-between mb-2 border-b-solid border-b-[1px] border-b-[#191b19] py-2">
        <div className="flex items-center gap-1 ">
          <div className="relative flex mr-3">
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#1a1a1a] bg-blue-900">
              <img
                src="src/assets/img/strkLogo.png"
                alt="STRK Token"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#1a1a1a] bg-gray-800 -ml-2">
              <img
                src="src/assets/img/ethLogo.png"
                alt="ETH Token"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>
          <td className=" py-4 whitespace-nowrap font-medium ">
            {pool.pair}{" "}
            <p className="text-xs pt-1 text-gray-600 flex gap-3">
              Stable <span>0.500%</span>{" "}
            </p>{" "}
          </td>
        </div>
        <div></div>
        <div className="text-gray-500 text-xs  flex items-center gap-1">
          <div className="bg-gray-500 h-3 w-3 rounded"></div>
          <p>Degen</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 justify-between">
        <div>
          <div className="text-tableHeads text-sm font-semibold mb-1">
            Liquidity
          </div>
          <div className="font-bold text-riskandliquidity text-md">
            {pool.liquidity}
          </div>
        </div>
        <div className="text-center">
          <div className="text-tableHeads text-sm font-semibold mb-1">APY</div>
          <div
            className={`font-bold ${pool.apy.includes("~") ? "text-red-500" : "text-[#00D1FF]"}`}
          >
            {pool.apy}
          </div>
        </div>
        <div className=" text-end">
          <div className="text-tableHeads text-sm font-semibold mb-1">
            Risk Level
          </div>
          <div className=" whitespace-nowrap text-riskandliquidity text-md">
            {pool.risk === "Low" ? (
              <span className="px-2 inline-flex leading-5 font-semibold ">
                {pool.risk}
              </span>
            ) : pool.risk === "High" ? (
              <span className=" inline-flex leading-5 font-semibold  ">
                {pool.risk}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full bg-transparent border-[#333] hover:bg-[#333] text-white"
      >
        DEPOSIT
      </Button>
    </div>
  );
}
