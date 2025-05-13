import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import BasicLine from './BasicLine'
import DashedLine from './DashedLine'
import BasicArea from './BasicArea'
import SplineArea from './SplineArea'
import BasicColumn from './BasicColumn'
import StackedColumn from './StackedColumn'
import BasicBar from './BasicBar'
import GroupedBar from './GroupedBar'
import SimplePie from './SimplePie'
import SimpleDonut from './SimpleDonut'

const mdPath = 'Charts'

const demoHeader = {
    title: 'Charts',
    desc: 'React-ApexCharts is a wrapper component for ApexCharts ready to be integrated into your react.js application to create stunning React Charts.',
}

const demos = [
    {
        mdName: 'BasicLine',
        mdPath: mdPath,
        title: 'Basic Line',
        desc: ``,
        component: <BasicLine />,
    },
    {
        mdName: 'DashedLine',
        mdPath: mdPath,
        title: 'Dashed Line',
        desc: ``,
        component: <DashedLine />,
    },
    {
        mdName: 'BasicArea',
        mdPath: mdPath,
        title: 'Basic Area',
        desc: ``,
        component: <BasicArea />,
    },
    {
        mdName: 'SplineArea',
        mdPath: mdPath,
        title: 'Spline Area',
        desc: ``,
        component: <SplineArea />,
    },
    {
        mdName: 'BasicColumn',
        mdPath: mdPath,
        title: 'Basic Column',
        desc: ``,
        component: <BasicColumn />,
    },
    {
        mdName: 'StackedColumn',
        mdPath: mdPath,
        title: 'Stacked Column',
        desc: ``,
        component: <StackedColumn />,
    },
    {
        mdName: 'BasicBar',
        mdPath: mdPath,
        title: 'Basic Bar',
        desc: ``,
        component: <BasicBar />,
    },
    {
        mdName: 'GroupedBar',
        mdPath: mdPath,
        title: 'Grouped Bar',
        desc: ``,
        component: <GroupedBar />,
    },
    {
        mdName: 'SimplePie',
        mdPath: mdPath,
        title: 'Simple Pie',
        desc: ``,
        component: <SimplePie />,
    },
    {
        mdName: 'SimpleDonut',
        mdPath: mdPath,
        title: 'Simple Donut',
        desc: ``,
        component: <SimpleDonut />,
    },
]

const demoApi = [
    {
        component: 'Charts',
        api: [
            {
                propName: 'type',
                type: `<code>string</code>`,
                default: `<code>'line'</code>`,
                desc: 'The chart type which is a mandatory prop to specify',
            },
            {
                propName: 'series',
                type: `<code>Array</code>`,
                default: `-`,
                desc: 'The data which you want to display in the chart',
            },
            {
                propName: 'width',
                type: `<code>string</code> | <code>number</code>`,
                default: `<code>'100%'</code>`,
                desc: 'Width of the chart',
            },
            {
                propName: 'height',
                type: `<code>string</code> | <code>number</code>`,
                default: `<code>'auto'</code>`,
                desc: 'Height of the chart',
            },
            {
                propName: 'options',
                type: `<code>object</code>`,
                default: `<code>{}</code>`,
                desc: 'All the optional configuration of the chart goes in this property',
            },
        ],
    },
]

const Extra = () => {
    return (
        <>
            <h4 className="mb-4">More Charts Examples?</h4>
            <p>
                There are several other charts which can be created by changing
                a couple of options. The major configuration has to be done in
                the <code>options</code> property of ApexCharts component and
                rest will fall into places. Refer to:
                <a
                    className="text-blue-500 hover:underline"
                    href="https://apexcharts.com/react-chart-demos/"
                    target="_blank"
                    rel="noreferrer"
                >
                    https://apexcharts.com/react-chart-demos/
                </a>
            </p>
        </>
    )
}

const Charts = () => {
    return (
        <DemoLayout
            header={demoHeader}
            demos={demos}
            api={demoApi}
            extra={<Extra />}
        />
    )
}

export default Charts
