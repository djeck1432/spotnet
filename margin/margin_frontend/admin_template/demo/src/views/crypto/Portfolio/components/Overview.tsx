import Card from '@/components/ui/Card'
import Chart from '@/components/shared/Chart'
import type { OverviewData } from '../store'

type OverviewProps = {
    className?: string
    data?: Partial<OverviewData>
}

const Overview = ({ data = {}, className }: OverviewProps) => {
    return (
        <Card className={className}>
            <h4>Statistic</h4>
            <div className="mt-4">
                <Chart series={data.series} xAxis={data.date} height="350px" />
            </div>
        </Card>
    )
}

export default Overview
