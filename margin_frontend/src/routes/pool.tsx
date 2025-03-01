import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Menu } from "lucide-react";

import { SearchBar } from "../ui/core/search-bar";
import { Tabs } from "../ui/core/tabs";
import PoolTable from "../ui/core/pool-table";
import PoolCard from "../ui/core/pool-card";


export const Route = createFileRoute("/pool")({
  component: Pool,
});


interface PoolType {
  id: number;
  name: string;
  type: string;
  baseApy: string;
  totalApy: string;
  liquidity: string;
  riskLevel: string;
  isDegen: boolean;
}

function Pool() {
  const [activeTab, setActiveTab] = useState<"all" | "stable" | "volatile">("all");
  const [searchTerm, setSearchTerm] = useState("");

  
  const pools: PoolType[] = Array(8)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      name: "STRK - ETH",
      type: "Stable",
      baseApy: "0.500%",
      totalApy: "8.5%",
      liquidity: "$1,250,000",
      riskLevel: "Low",
      isDegen: true,
    }));

  
  const visiblePools = pools.filter((pool) => {
    const matchesTab = activeTab === "all" || pool.type.toLowerCase() === activeTab;
    const matchesSearch = pool.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#0c0c0c] text-[#fffcfc]">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        
        <div className="flex lg:hidden items-center justify-between mb-8">
          <SearchBar className="flex-1" onChange={(val) => setSearchTerm(val)} />
          <button className="ml-4 text-gray-400">
            <Menu size={24} />
          </button>
        </div>

        <div className="mb-10 max-w-[400px]">
          <h1 className="text-4xl font-bold mb-3 tracking-tight">POOLS</h1>
          <p className="text-base text-[#b4b4b4]">
            Earn passive income by providing liquidity to top trading pairs. Choose a pool, deposit funds, and start earning.
          </p>
        </div>


        <div className="hidden lg:grid grid-cols-7 gap-6">
          
          <div className="col-span-5">
            <Tabs
              className=""
              tabs={[
                { label: "All", value: "all" },
                { label: "Stable", value: "stable" },
                { label: "Volatile", value: "volatile" },
              ]}
              activeTab={activeTab}
              onChange={(val) => setActiveTab(val as typeof activeTab)}
            />
            <PoolTable pools={visiblePools} />
          </div>

          
          <div className="col-span-2">
            <div className="mb-6">
              <SearchBar
                className="w-full"
                onChange={(val) => setSearchTerm(val)}
              />
            </div>
          </div>
        </div>


        <div className="lg:hidden">
          <Tabs
            className="mb-4"
            tabs={[
              { label: "All", value: "all" },
              { label: "Stable", value: "stable" },
              { label: "Volatile", value: "volatile" },
            ]}
            activeTab={activeTab}
            onChange={(val) => setActiveTab(val as typeof activeTab)}
          />
          <div className="space-y-4">
            {visiblePools.map((pool) => (
              <PoolCard key={pool.id} pool={pool} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Pool;
