import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Line from './Line'
import Bar from './Bar'
import Area from './Area'
import Donut from './Donut'

const mdPath = 'ChartDoc'

const demoHeader = {
    title: 'Chart',
    desc: 'This is higher level component of <a class="text-indigo-600 underline" href="https://apexcharts.com/docs/react-charts/" target="_blank">ApexChart</a>, it come with several preconfig chart setup that adapted to the theme.',
}

const demos = [
    {
        mdName: 'Line',
        mdPath: mdPath,
        title: 'Line',
        desc: ``,
        component: <Line />,
    },
    {
        mdName: 'Bar',
        mdPath: mdPath,
        title: 'Bar',
        desc: ``,
        component: <Bar />,
    },
    {
        mdName: 'Area',
        mdPath: mdPath,
        title: 'Area',
        desc: ``,
        component: <Area />,
    },
    {
        mdName: 'Donut',
        mdPath: mdPath,
        title: 'Donut',
        desc: ``,
        component: <Donut />,
    },
]

const demoApi = [
    {
        component: 'Chart',
        api: [
            {
                propName: 'customOptions',
                type: `<a class="text-indigo-600 underline" href="https://apexcharts.com/docs/options/annotations/" target="_blank">Apexcharts option</a>`,
                default: `-`,
                desc: 'Custom options for chart',
            },
            {
                propName: 'donutTitle',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Title inside donut chart',
            },
            {
                propName: 'height',
                type: `<code>string</code> | <code>number</code>`,
                default: `-`,
                desc: 'Chart height',
            },
            {
                propName: 'series',
                type: `<a class="text-indigo-600 underline" href="https://apexcharts.com/docs/series/" target="_blank">Apexcharts Series</a>`,
                default: `-`,
                desc: 'Chart series',
            },
            {
                propName: 'type',
                type: `<code>'line'</code> | <code>'bar'</code> | <code>'area'</code> | <code>'donut'</code>`,
                default: `-`,
                desc: 'Chart type',
            },
            {
                propName: 'width',
                type: `<code>string</code> | <code>number</code>`,
                default: `-`,
                desc: 'Chart width',
            },
            {
                propName: 'xAxis',
                type: `<a class="text-indigo-600 underline" href="https://apexcharts.com/docs/options/xaxis/" target="_blank">Apexcharts xAxis</a>`,
                default: `-`,
                desc: 'Chart xAxis',
            },
        ],
    },
]

const ChartDoc = () => {
    return (
        <DemoLayout
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            api={demoApi}
            mdPrefixPath="shared"
        />
    )
}

export default ChartDoc
