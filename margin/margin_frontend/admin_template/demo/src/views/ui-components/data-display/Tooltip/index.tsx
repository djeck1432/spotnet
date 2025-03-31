import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Placement from './Placement'
import Customize from './Customize'

const mdPath = 'Tooltip'

const demoHeader = {
    title: 'Tooltip',
    desc: 'Tooltips will appear when users hover on an element, it display contextual information related to the element.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of Tooltip.`,
        component: <Basic />,
    },
    {
        mdName: 'Customize',
        mdPath: mdPath,
        title: 'Customize',
        desc: `Tooltip content can be customize as well.`,
        component: <Customize />,
    },
    {
        mdName: 'Placement',
        mdPath: mdPath,
        title: 'Placement',
        desc: `There are 9 placement options for tooltip, it occupies the top position by default.`,
        component: <Placement />,
    },
]

const demoApi = [
    {
        component: 'Tooltip',
        api: [
            {
                propName: 'isOpen',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to display tooltip by default',
            },
            {
                propName: 'placement',
                type: `<code>'top'</code> | <code>'top-start'</code> | <code>'top-end'</code> | <code>'bottom'</code> | <code>'bottom-start'</code> | <code>'bottom-end'</code> | <code>'right'</code> | <code>'right-start'</code> | <code>'right-end'</code> | <code>'left'</code> | <code>'left-start'</code> | <code>'left-end'</code>`,
                default: `<code>'top'</code>`,
                desc: 'Tooltip placement',
            },
            {
                propName: 'title',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: ``,
                desc: 'Tooltip content',
            },
            {
                propName: 'wrapperClass',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Class for tooltip wrapper',
            },
        ],
    },
]

const Tooltip = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Tooltip
