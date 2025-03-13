import { Button } from "./button";

interface PoolCardProps {
	pool: {
		id: number;
		name: string;
		type: string;
		baseApy: string;
		totalApy: string;
		liquidity: string;
		riskLevel: string;
		isDegen: boolean;
	};
}

export default function PoolCard({ pool }: PoolCardProps) {
	return (
		<div className="bg-[#090a08] bricolage rounded-lg p-5 text-baseWhite">
			<div className="flex items-center justify-between mb-2 border-b-solid border-b-[1px] border-b-[#191b19] py-2">
				<div className="flex items-center">
					<div className="relative flex mr-3">
						<div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#1a1a1a] bg-blue-900">
							<img src="src/assets/img/strkLogo.png" alt="STRK Token" width={40} height={40} className="object-cover" />
						</div>
						<div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#1a1a1a] bg-gray-800 -ml-2">
							<img src="src/assets/img/ethLogo.png" alt="ETH Token" width={40} height={40} className="object-cover" />
						</div>
					</div>
					<div>
						<div className="font-bold text-md">{pool.name}</div>
						<div className="text-sm font-semibold text-headerText flex jusify-between gap-3">
							<section>{pool.type}</section>
							<section> {pool.baseApy}</section>
						</div>
					</div>
				</div>

				{pool.isDegen && (
					<div className="bg-[#333] px-2 py-1 rounded text-xs text-gray-300 flex flex-row items-center gap-1">
						{" "}
						<div className="h-[8px] w-[8px] bg-[#898989] rounded-[2px]" />
						Degen
					</div>
				)}
			</div>

			<div className="grid grid-cols-3 gap-4 mb-4 justify-between">
				<div>
					<div className="text-tableHeads text-sm font-semibold mb-1">Liquidity</div>
					<div className="font-bold text-riskandliquidity text-md">{pool.liquidity}</div>
				</div>
				<div className="text-center">
					<div className="text-tableHeads text-sm font-semibold mb-1">APY</div>
					<div className="font-bold text-APY">{pool.totalApy}</div>
				</div>
				<div className=" text-end">
					<div className="text-tableHeads text-sm font-semibold mb-1">Risk Level</div>
					<div className="font-bold text-riskandliquidity text-md">{pool.riskLevel}</div>
				</div>
			</div>

			<Button variant="outline" className="w-full bg-transparent border-[#333] hover:bg-[#333] text-white">
				DEPOSIT
			</Button>
		</div>
	);
}
