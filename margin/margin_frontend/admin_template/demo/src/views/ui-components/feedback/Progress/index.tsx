import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import ProgressBar from './ProgressBar'
import Colors from './Colors'
import Size from './Size'
import Circle from './Circle'
import CustomInfo from './CustomInfo'
import Dynamic from './Dynamic'

const mdPath = 'Progress'

const demoHeader = {
    title: 'Progress',
    desc: 'A Progress loader show the progression of an operation flow in visual way.',
}

const demos = [
    {
        mdName: 'ProgressBar',
        mdPath: mdPath,
        title: 'Progress Bar',
        desc: `Progress in progress bar was controlled by <code>percent</code> prop.`,
        component: <ProgressBar />,
    },
    {
        mdName: 'Circle',
        mdPath: mdPath,
        title: 'Circle',
        desc: `Alternatively, we can display the Progress in circle by setting <code>variant</code> to 'circle'`,
        component: <Circle />,
    },
    {
        mdName: 'Colors',
        mdPath: mdPath,
        title: 'Colors',
        desc: `We can apply custom color to the progress bar, available colors option based on tailwind <code>theme.colors</code>.`,
        component: <Colors />,
    },
    {
        mdName: 'Size',
        mdPath: mdPath,
        title: 'Size',
        desc: `Adjusting progress size via <code>size</code> prop for line progress or <code>width</code> prop for circle progress.`,
        component: <Size />,
    },
    {
        mdName: 'CustomInfo',
        mdPath: mdPath,
        title: 'CustomInfo',
        desc: `We can insert any custom content via <code>customInfo/code>.`,
        component: <CustomInfo />,
    },
    {
        mdName: 'Dynamic',
        mdPath: mdPath,
        title: 'Dynamic',
        desc: `Example of dynamic progress.`,
        component: <Dynamic />,
    },
]

const demoApi = [
    {
        component: 'Progress',
        api: [
            {
                propName: 'color',
                type: `<code>string</code>`,
                default: 'current theme color',
                desc: 'Custom color for Progress, available colors option based on tailwind <code>theme.colors</code>',
            },
            {
                propName: 'customInfo',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: '-',
                desc: 'Custom content',
            },
            {
                propName: 'gapDegree',
                type: `<code>number</code>`,
                default: '<code>0</code>',
                desc: 'The gap degree of circle progress (only applicable when variant="circle")',
            },
            {
                propName: 'gapPosition',
                type: `<code>'top'</code> | <code>'right'</code> | <code>'bottom'</code> | <code>'left'</code> `,
                default: `<code>'top'</code>`,
                desc: 'Gap postion of circle progress (only applicable when variant="circle")',
            },
            {
                propName: 'percent',
                type: `<code>number</code>`,
                default: '<code>0</code>',
                desc: 'The current value of progress',
            },
            {
                propName: 'showInfo',
                type: `<code>boolean</code>`,
                default: '<code>true</code>',
                desc: 'Whether to display progress info',
            },
            {
                propName: 'size',
                type: `<code>'sm'</code> | <code>'md'</code>`,
                default: `<code>'md'</code>`,
                desc: 'Size of progress bar (only applicable when variant="line")',
            },
            {
                propName: 'strokeLinecap',
                type: `<code>'round'</code> | <code>'square'</code>`,
                default: `<code>'round'</code>`,
                desc: 'Style of the progress linecap (only applicable when variant="circle")',
            },
            {
                propName: 'strokeWidth',
                type: `<code>number</code>`,
                default: `<code>6</code>`,
                desc: 'Width of the circular progress (only applicable when variant="circle")',
            },
            {
                propName: 'variant',
                type: `<code>'line'</code> | <code>'circle'</code>`,
                default: `<code>'line'</code>`,
                desc: 'Progress variants',
            },
            {
                propName: 'width',
                type: `<code>number</code> | <code>string</code>`,
                default: `<code>'line'</code>`,
                desc: 'Determine the size of circular progress (only applicable when variant="circle")',
            },
        ],
    },
]

const Progress = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Progress
