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
export default function PoolTable({ pools }: PoolTableProps): import("react/jsx-runtime").JSX.Element;
export {};
