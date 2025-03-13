import { useIsMobile } from "../hooks/use-mobile";
import { Button } from "./button";
import PoolCard from "./pool-card";
import PoolHeader from "./pool-head";
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
	const IsMobile = useIsMobile();
	return (
		<div className="overflow-x-hidden">
			{IsMobile ? (
				<div className="lg:hidden space-y-4">
					{pools.map((pool) => (
						<PoolCard key={pool.id} pool={pool} />
					))}
				</div>
			) : (
				<table className="w-full border-collapse bricolage table-fixed">
					<thead className="">
						<tr className="text-left text-tableHeads py-4">
							<th className="text-sm font-semibold pb-4 w-1/4 lg:w-1/3 pl-4">Pool</th>
							<th className="text-sm font-semibold pb-4">APY %</th>
							<th className="text-sm font-semibold pb-4">Risk Level</th>
							<th className="text-sm font-semibold pb-4">Liquidity</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-grayborder text-baseWhite border-grayborder border-solid border-1">
						{pools.map((pool) => (
							<tr key={pool.id} className="hover:bg-[#1a1a1a]">
								<td className="py-4">
									<div className="flex items-center pl-2">
										<PoolHeader />
										<div>
											<div className="font-bold text-md">{pool.name}</div>
											<div className="text-sm font-semibold text-headerText flex jusify-between gap-3">
												<section>{pool.type}</section>
												<section> {pool.baseApy}</section>
											</div>
										</div>
									</div>
								</td>
								<td className="py-4">
									<span className="font-bold text-APY">{pool.totalApy}</span>
								</td>
								<td className="py-4 font-bold text-sm text-riskandliquidity">{pool.riskLevel}</td>
								<td className="py-4 text-riskandliquidity text-sm">{pool.liquidity}</td>
								<td className="py-4">
									<Button
										variant="outline"
										className="bg-transparent border-grayborder hover:bg-[#333] text-white py-2 min-w-[142px] h-[37px]"
									>
										DEPOSIT
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
