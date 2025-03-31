import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Segment from '@/components/ui/Segment'
import Badge from '@/components/ui/Badge'
import Loading from '@/components/shared/Loading'
import Chart from '@/components/shared/Chart'
import { COLORS } from '@/constants/chart.constant'
import isEmpty from 'lodash/isEmpty'
import { useAppSelector } from '../store'

type ProjectOverviewChart = {
    onGoing: number
    finished: number
    total: number
    series: {
        name: string
        data: number[]
    }[]
    range: string[]
}

type TaskOverviewProps = {
    data?: {
        chart?: Record<string, ProjectOverviewChart>
    }
    className?: string
}

type ChartLegendProps = {
    label: string
    value: number
    badgeClass?: string
    showBadge?: boolean
}

const ChartLegend = ({
    label,
    value,
    badgeClass,
    showBadge = true,
}: ChartLegendProps) => {
    return (
        <div className="flex gap-2">
            {showBadge && <Badge className="mt-2.5" innerClass={badgeClass} />}
            <div>
                <h5 className="font-bold">{value}</h5>
                <p>{label}</p>
            </div>
        </div>
    )
}

const TaskOverview = ({ data = {}, className }: TaskOverviewProps) => {
    const [timeRange, setTimeRange] = useState(['weekly'])

    const [repaint, setRepaint] = useState(false)

    const sideNavCollapse = useAppSelector(
        (state) => state.theme.layout.sideNavCollapse,
    )

    useEffect(() => {
        setRepaint(true)
        const timer1 = setTimeout(() => setRepaint(false), 300)

        return () => {
            clearTimeout(timer1)
        }
    }, [data, sideNavCollapse])

    return (
        <Card className={className}>
            <div className="flex sm:flex-row flex-col md:items-center justify-between mb-6 gap-4">
                <h4>Task Overview</h4>
                <Segment
                    value={timeRange}
                    size="sm"
                    onChange={(val: string | string[]) =>
                        setTimeRange(val as string[])
                    }
                >
                    <Segment.Item value="monthly">Monthly</Segment.Item>
                    <Segment.Item value="weekly">Weekly</Segment.Item>
                    <Segment.Item value="daily">Daily</Segment.Item>
                </Segment>
            </div>
            {!isEmpty(data) && !repaint && data.chart && (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <ChartLegend
                                showBadge={false}
                                label="Total Tasks"
                                value={data.chart[timeRange[0]].total}
                            />
                        </div>
                        <div className="flex gap-x-6">
                            <ChartLegend
                                badgeClass="bg-indigo-600"
                                label={data.chart[timeRange[0]].series[0].name}
                                value={data.chart[timeRange[0]].onGoing}
                            />
                            <ChartLegend
                                badgeClass="bg-emerald-500"
                                label={data.chart[timeRange[0]].series[1].name}
                                value={data.chart[timeRange[0]].finished}
                            />
                        </div>
                    </div>
                    <div>
                        <Chart
                            series={data.chart[timeRange[0]].series}
                            xAxis={data.chart[timeRange[0]].range}
                            type="bar"
                            customOptions={{
                                colors: [COLORS[0], COLORS[2]],
                                legend: { show: false },
                            }}
                        />
                    </div>
                </>
            )}
            <Loading loading={repaint} type="cover">
                {repaint && <div className="h-[300px]" />}
            </Loading>
        </Card>
    )
}

export default TaskOverview
