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
export default function PoolCard({ pool }: PoolCardProps): import("react/jsx-runtime").JSX.Element;
export {};
