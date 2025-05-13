import { useState } from 'react'
import Card from '@/components/ui/Card'
import Segment from '@/components/ui/Segment'
import Chart from '@/components/shared/Chart'
import { NumericFormat } from 'react-number-format'
import isEmpty from 'lodash/isEmpty'
import type { PortfolioStats } from '../store'

type PortfolioStatsProps = {
    data?: Partial<PortfolioStats>
    className?: string
}

const PortfolioStats = ({ data = {}, className }: PortfolioStatsProps) => {
    const [timeRange, setTimeRange] = useState<string[]>(['month'])

    return (
        <Card className={className}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div>
                    <p>Portfolio Balance</p>
                    <h4 className="font-bold">
                        {!isEmpty(data) && (
                            <NumericFormat
                                thousandSeparator
                                displayType="text"
                                value={
                                    data[timeRange[0]]?.series[0].data[
                                        (data[timeRange[0]]?.series[0].data
                                            .length as number) - 1
                                    ]
                                }
                                prefix="$"
                            />
                        )}
                    </h4>
                </div>
                <Segment
                    value={timeRange}
                    size="sm"
                    onChange={(val) => setTimeRange(val as string[])}
                >
                    <Segment.Item value="week">Week</Segment.Item>
                    <Segment.Item value="month">Month</Segment.Item>
                    <Segment.Item value="year">Year</Segment.Item>
                </Segment>
            </div>
            {!isEmpty(data) && (
                <Chart
                    series={data[timeRange[0]]?.series}
                    xAxis={data[timeRange[0]]?.timeRange}
                    height="350px"
                    customOptions={{ legend: { show: false } }}
                />
            )}
        </Card>
    )
}

export default PortfolioStats
