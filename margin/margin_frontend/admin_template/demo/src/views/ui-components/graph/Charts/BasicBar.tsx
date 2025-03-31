import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'

const BasicBar = () => {
    const data = [
        {
            data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
        },
    ]

    return (
        <Chart
            options={{
                plotOptions: {
                    bar: {
                        horizontal: true,
                    },
                },
                colors: COLORS,
                dataLabels: {
                    enabled: false,
                },
                xaxis: {
                    categories: [
                        'South Korea',
                        'Canada',
                        'United Kingdom',
                        'Netherlands',
                        'Italy',
                        'France',
                        'Japan',
                        'United States',
                        'China',
                        'Germany',
                    ],
                },
            }}
            series={data}
            type="bar"
            height={300}
        />
    )
}

export default BasicBar
