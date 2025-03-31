import { createFileRoute } from "@tanstack/react-router";
import { Menu, Search } from "lucide-react";
import { Input } from "../ui/core/input";
import PoolTable from "../ui/core/pool-table";
import { Tabs } from "../ui/core/tab";
export const Route = createFileRoute("/pool")({
  component: Pool,
});

function Pool() {
  // Sample pool data
  const pools = [
    {
      pair: "STRK - ETH",
      apy: "8.9%",
      risk: "Low",
      liquidity: "$1,250,000",
      type: "All",
    },
    {
      pair: "STRK - ETH",
      apy: "0.00%",
      risk: "Low",
      liquidity: "$1,250,000",
      type: "Statute",
    },
    {
      pair: "STRK - ETH",
      apy: "~2.39%",
      risk: "High",
      liquidity: "$1,250,000",
      type: "All",
    },
    {
      pair: "STRK - ETH",
      apy: "~2.39%",
      risk: "High",
      liquidity: "$1,250,000",
      type: "Volatile",
    },
    {
      pair: "STRK - ETH",
      apy: "~2.39%",
      risk: "High",
      liquidity: "$1,250,000",
      type: "All",
    },
    {
      pair: "STRK - ETH",
      apy: "0.00%",
      risk: "High",
      liquidity: "$1,250,000",
      type: "Statute",
    },
    {
      pair: "STRK - ETH",
      apy: "0.00%",
      risk: "Low",
      liquidity: "$1,250,000",
      type: "All",
    },
    {
      pair: "STRK - ETH",
      apy: "~2.39%",
      risk: "High",
      liquidity: "$1,250,000",
      type: "Volatile",
    },
    {
      pair: "STRK - ETH",
      apy: "~2.39%",
      risk: "High",
      liquidity: "$1,250,000",
      type: "All",
    },
    {
      pair: "STRK - ETH",
      apy: "~2.39%",
      risk: "High",
      liquidity: "$1,250,000",
      type: "Statute",
    },
    {
      pair: "STRK - ETH",
      apy: "0.00%",
      risk: "Low",
      liquidity: "$1,250,000",
      type: "All",
    },
  ];
  const Tab = [
    {
      label: "All",
      content: <PoolTable pools={pools} />,
      id: "all-tab",
    },
    {
      label: "Stable",
      content: "to be replced with stable component",
      id: "stable-tab",
    },
    {
      label: "Volatile",
      content: "to be replaced with volatile component",
      id: "volatile-tab",
    },
  ];
  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-8 pb-6 pt-2 ">
      <div className="flex md:hidden items-center justify-between mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#848484]" />
          <Input
            placeholder="Search..."
            className="pl-10 h-[48px] w-full max-w-[305px]  bg-transparent border-[#191819] border-solid border-[1px] rounded-[8px] text-[#848484] bricolage"
          />
        </div>
        <button type="button" className="ml-4 text-gray-400 md:hidden">
          <Menu size={24} />
        </button>
      </div>

      <div className="my-8 max-w-[400px]">
        <h1 className="text-3xl font-bold mb-3 text-btnBorderColor bricolage">
          POOLS
        </h1>
        <p className="text-baseWhite bricolage text-sm font-semibold">
          Earn passive income by providing liquidity to top trading pairs.
          Choose a pool, deposit funds, and start earning.
        </p>
      </div>

      <div className="grid lg:grid-cols-7 gap-4 ">
        <div className="col-span-5">
          <Tabs defaultActiveIndex={0} tabs={Tab} />
        </div>

        <div className="col-span-2 hidden lg:block">
          <div className="flex  items-center justify-between mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#848484]" />
              <Input
                placeholder="Search..."
                className="pl-10 h-[48px] w-full max-w-[305px]  bg-transparent border-grayborder border-solid border-1 rounded-full text-[#848484] bricolage"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
