import { Button } from "./button";

interface Pool {
	id: number;
	name: string;
	type: string;
	baseApy: string;
	totalApy: string;
	liquidity: string;
	riskLevel: string;
	isDegen: boolean;
}

interface PoolTableProps {
	pools: Pool[];
}

export default function PoolTable({ pools }: PoolTableProps) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full border-collapse">
				<thead>
					<tr className="text-left text-gray-400">
						<th className="pb-4 font-medium">Pool</th>
						<th className="pb-4 font-medium">APY %</th>
						<th className="pb-4 font-medium">Risk Level</th>
						<th className="pb-4 font-medium">Liquidity</th>
						<th className="pb-4 font-medium" />
					</tr>
				</thead>
				<tbody className="divide-y divide-[#333] text-baseWhite">
					{pools.map((pool) => (
						<tr key={pool.id} className="hover:bg-[#1a1a1a]">
							<td className="py-4">
								<div className="flex items-center">
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
									<div>
										<div className="font-bold">{pool.name}</div>
										<div className="text-sm text-gray-400">
											{pool.type} • {pool.baseApy}
										</div>
									</div>
									{pool.isDegen && <div className="ml-2 bg-[#333] px-2 py-1 rounded text-xs text-gray-300">Degen</div>}
								</div>
							</td>
							<td className="py-4">
								<span className="font-bold text-green-500">{pool.totalApy}</span>
							</td>
							<td className="py-4">{pool.riskLevel}</td>
							<td className="py-4">{pool.liquidity}</td>
							<td className="py-4">
								<Button variant="outline" className="bg-transparent border-[#333] hover:bg-[#333] text-white py-2 px-6">
									DEPOSIT
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
