import { useRef, useEffect, useCallback, useMemo } from 'react'
import ApexChart from 'react-apexcharts'
import {
    apexLineChartDefaultOption,
    apexBarChartDefaultOption,
    apexAreaChartDefaultOption,
    apexDonutChartDefaultOption,
} from '@/configs/chart.config'
import { DIR_RTL } from '@/constants/theme.constant'
import type { ApexOptions } from 'apexcharts'
import type { Direction } from '@/@types/theme'
import type { ReactNode } from 'react'

const notDonut = ['line', 'bar', 'area']

type ChartType = 'line' | 'bar' | 'area' | 'donut'

export interface ChartProps {
    series?: ApexOptions['series']
    width?: string | number
    height?: string | number
    /* eslint-disable @typescript-eslint/no-explicit-any */
    xAxis?: any
    customOptions?: ApexOptions
    type?: ChartType
    direction?: Direction
    donutTitle?: string | ReactNode
    donutText?: string | ReactNode
    className?: string
}

const Chart = (props: ChartProps) => {
    const {
        series = [],
        width = '100%',
        height = 300,
        xAxis,
        customOptions,
        type = 'line',
        direction,
        donutTitle,
        donutText,
        className,
        ...rest
    } = props

    const chartRef = useRef<HTMLDivElement>(null)

    const chartDefaultOption = useMemo(() => {
        switch (type) {
            case 'line':
                return apexLineChartDefaultOption
            case 'bar':
                return apexBarChartDefaultOption
            case 'area':
                return apexAreaChartDefaultOption
            case 'donut':
                return apexDonutChartDefaultOption
            default:
                return apexLineChartDefaultOption
        }
    }, [type])

    let options = JSON.parse(JSON.stringify(chartDefaultOption))
    const isMobile = window.innerWidth < 768

    const setLegendOffset = useCallback(() => {
        if (chartRef.current) {
            const lengend = chartRef.current.querySelectorAll<HTMLDivElement>(
                'div.apexcharts-legend',
            )[0]
            if (direction === DIR_RTL) {
                lengend.style.right = 'auto'
                lengend.style.left = '0'
            }
            if (isMobile) {
                lengend.style.position = 'relative'
                lengend.style.top = '0'
                lengend.style.justifyContent = 'start'
                lengend.style.padding = '0'
            }
        }
    }, [direction, isMobile])

    useEffect(() => {
        if (notDonut.includes(type as ChartType)) {
            setLegendOffset()
        }
    }, [type, setLegendOffset])

    if (notDonut.includes(type as ChartType)) {
        options.xaxis.categories = xAxis
    }

    if (customOptions) {
        options = { ...options, ...customOptions }
    }

    if (type === 'donut') {
        if (donutTitle) {
            options.plotOptions.pie.donut.labels.total.label = donutTitle
        }
        if (donutText) {
            options.plotOptions.pie.donut.labels.total.formatter = () =>
                donutText
        }
    }

    return (
        <div
            ref={chartRef}
            style={direction === DIR_RTL ? { direction: 'ltr' } : {}}
            className="chartRef"
        >
            <ApexChart
                options={options}
                type={type}
                series={series}
                width={width}
                height={height}
                className={className}
                {...rest}
            />
        </div>
    )
}

export default Chart
