import { COLORS } from '@/constants/chart.constant'
import type { ApexOptions } from 'apexcharts'

export const apexLineChartDefaultOption: ApexOptions = {
    chart: {
        zoom: {
            enabled: false,
        },
        toolbar: {
            show: false,
        },
    },
    colors: [...COLORS],
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: 2.5,
        curve: 'smooth',
        lineCap: 'round',
    },
    legend: {
        itemMargin: {
            vertical: 10,
        },
        tooltipHoverFormatter: function (val, opts) {
            return (
                val +
                ' - ' +
                opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
                ''
            )
        },
    },
    xaxis: {
        categories: [],
    },
}

export const apexAreaChartDefaultOption = { ...apexLineChartDefaultOption }

export const apexBarChartDefaultOption: ApexOptions = {
    chart: {
        zoom: {
            enabled: false,
        },
        toolbar: {
            show: false,
        },
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '30px',
            borderRadius: 2,
        },
    },
    colors: [...COLORS],
    dataLabels: {
        enabled: false,
    },
    stroke: {
        show: true,
        width: 6,
        curve: 'smooth',
        colors: ['transparent'],
    },
    legend: {
        itemMargin: {
            vertical: 10,
        },
        tooltipHoverFormatter: function (val, opts) {
            return (
                val +
                ' - ' +
                opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
                ''
            )
        },
    },
    xaxis: {
        categories: [],
    },
    fill: {
        opacity: 1,
    },
    tooltip: {
        y: {
            formatter: (val) => `${val}`,
        },
    },
}

export const apexDonutChartDefaultOption: ApexOptions = {
    colors: [...COLORS],
    plotOptions: {
        pie: {
            donut: {
                labels: {
                    show: true,
                    total: {
                        show: true,
                        showAlways: true,
                        label: '',
                        formatter: function (w) {
                            return w.globals.seriesTotals.reduce(
                                (a: string, b: string) => {
                                    return a + b
                                },
                                0,
                            )
                        },
                    },
                },
                size: '85%',
            },
        },
    },
    stroke: {
        colors: ['transparent'],
    },
    labels: [],
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: false,
    },
}

export const apexSparklineChartDefultOption: ApexOptions = {
    chart: {
        type: 'line',
        sparkline: {
            enabled: true,
        },
    },
    stroke: {
        width: 2,
        curve: 'smooth',
    },
    tooltip: {
        fixed: {
            enabled: false,
        },
        x: {
            show: false,
        },
        y: {
            title: {
                formatter: function () {
                    return ''
                },
            },
        },
        marker: {
            show: false,
        },
    },
}
