import Chart from '@/components/shared/Chart'

const Donut = () => {
    const data = {
        labels: ['Item A', 'Item B', 'Item C'],
        values: [15032, 11246, 8273],
        coinSymbol: ['A', 'B', 'C'],
    }

    return (
        <Chart
            donutTitle={`$${data.values.reduce((a, b) => a + b, 0)}`}
            donutText="Assets"
            series={data.values}
            customOptions={{ labels: data.labels }}
            type="donut"
            height={230}
        />
    )
}

export default Donut
