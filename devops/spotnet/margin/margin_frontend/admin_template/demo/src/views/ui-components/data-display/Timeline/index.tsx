import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Advance from './Advance'

const mdPath = 'Timeline'

const demoHeader = {
    title: 'Timeline',
    desc: 'Timeline displays a list of events in chronological order.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: ``,
        component: <Basic />,
    },
    {
        mdName: 'Advance',
        mdPath: mdPath,
        title: 'Advance',
        desc: ``,
        component: <Advance />,
    },
]

const demoApi = [
    {
        component: 'Timeline.Item',
        api: [
            {
                propName: 'media',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Timeline item media (Note: media width must be consistent between Timeline item)',
            },
        ],
    },
]

const Timeline = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Timeline
