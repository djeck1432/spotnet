"use client";

import { Menu, Search } from "lucide-react";
import { useState } from "react";

import { Input } from "../ui/core/input";
import PoolCard from "../ui/core/pool-card";
import PoolTable from "../ui/core/pool-table";
import { Footer } from "../ui/layout/footer";
import { Header } from "../ui/layout/header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pool")({
	component: Pools
});

export default function Pools() {
	const [activeTab, setActiveTab] = useState("all");
	

	// Sample pool data
	const pools = Array(8)
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

	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
				<div className="flex lg:hidden items-center justify-between mb-8">
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#848484]" />
						<Input
							placeholder="Search..."
							className="pl-10 h-12 w-full bg-[#1a1a1a] border-[#333] rounded-full text-[#848484]"
						/>
					</div>
					<button type="button" className="ml-4 text-gray-400 lg:hidden">
						<Menu size={24} />
					</button>
				</div>

				<div className="my-8 max-w-[400px]">
					<h1 className="text-4xl font-bold mb-3 text-btnBorderColor">POOLS</h1>
					<p className="text-baseWhite ">
						Earn passive income by providing liquidity to top trading pairs. Choose a pool, deposit funds, and start
						earning.
					</p>
				</div>

				<div className="hidden lg:grid grid-cols-7 gap-4">
					<div className=" col-span-5">
						<div className="border-b border-[#333] mb-6">
							<div className="flex">
								<button
									type="button"
									onClick={() => {
										setActiveTab("all");
									}}
									className={`px-6 py-4 font-medium text-sm relative ${
										activeTab === "all" ? "text-white" : "text-gray-400"
									}`}
								>
									All
									{activeTab === "all" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white" />}
								</button>
								<button
									type="button"
									onClick={() => {
										setActiveTab("stable");
									}}
									className={`px-6 py-4 font-medium text-sm relative ${
										activeTab === "stable" ? "text-white" : "text-gray-400"
									}`}
								>
									Stable
									{activeTab === "stable" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white" />}
								</button>
								<button
									type="button"
									onClick={() => {
										setActiveTab("volatile");
									}}
									className={`px-6 py-4 font-medium text-sm relative ${
										activeTab === "volatile" ? "text-white" : "text-gray-400"
									}`}
								>
									Volatile
									{activeTab === "volatile" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white" />}
								</button>
							</div>
						</div>
						<div className="hidden lg:block">
							<PoolTable pools={pools} />
						</div>{" "}
					</div>
					<div className="col-span-2">
						<div className="flex  items-center justify-between mb-8">
							<div className="relative flex-1 max-w-md">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#848484]" />
								<Input
									placeholder="Search..."
									className="pl-10 h-12 w-full bg-[#1a1a1a] border-[#333] rounded-full text-[#848484]"
								/>
							</div>
							<button type="button" className="ml-4 text-gray-400 lg:hidden">
								<Menu size={24} />
							</button>
						</div>
					</div>
				</div>

				<div className="lg:hidden space-y-4">
					{pools.map((pool) => (
						<PoolCard key={pool.id} pool={pool} />
					))}
				</div>
			</div>

			<Footer />
		</div>
	);
}
