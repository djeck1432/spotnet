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
		<div className="bg-[#1a1a1a] rounded-lg p-5 text-baseWhite">
			<div className="flex items-center justify-between mb-4">
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
						<h3 className="font-bold text-lg">{pool.name}</h3>
						<div className="flex items-center text-sm text-gray-400">
							<span>{pool.type}</span>
							<span className="mx-2">•</span>
							<span>{pool.baseApy}</span>
						</div>
					</div>
				</div>

				{pool.isDegen && <div className="bg-[#333] px-2 py-1 rounded text-xs text-gray-300">Degen</div>}
			</div>

			<div className="grid grid-cols-3 gap-4 mb-4">
				<div>
					<div className="text-gray-400 text-sm mb-1">Liquidity</div>
					<div className="font-bold">{pool.liquidity}</div>
				</div>
				<div>
					<div className="text-gray-400 text-sm mb-1">APY</div>
					<div className="font-bold text-green-500">{pool.totalApy}</div>
				</div>
				<div>
					<div className="text-gray-400 text-sm mb-1">Risk Level</div>
					<div className="font-bold">{pool.riskLevel}</div>
				</div>
			</div>

			<Button variant="outline" className="w-full bg-transparent border-[#333] hover:bg-[#333] text-white">
				DEPOSIT
			</Button>
		</div>
	);
}
