import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import CountOverflow from './CountOverflow'
import Dot from './Dot'
import Inline from './Inline'
import Color from './Color'

const mdPath = 'Badge'

const demoHeader = {
    title: 'Badge',
    desc: `Badges often used to highlight an item's status to notify the user.`,
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Badge <code>content</code> prop accept both <code>string</code> & <code>number</code> type.`,
        component: <Basic />,
    },
    {
        mdName: 'CountOverflow',
        mdPath: mdPath,
        title: 'Count Overflow',
        desc: `Badge will display the <code>maxCount</code> prop number, if the content number is larger than the <code>maxCount</code> prop number.`,
        component: <CountOverflow />,
    },
    {
        mdName: 'Dot',
        mdPath: mdPath,
        title: 'Dot',
        desc: `Badge will display as dot if without <code>content</code> prop.`,
        component: <Dot />,
    },
    {
        mdName: 'Inline',
        mdPath: mdPath,
        title: 'Inline',
        desc: `Display Badge inline by leaving <code>children</code> empty.`,
        component: <Inline />,
    },
    {
        mdName: 'Color',
        mdPath: mdPath,
        title: 'Color',
        desc: `Badge can have different color by setting color value via <code>backgroundColor</code> & <code>textColor</code>.`,
        component: <Color />,
    },
]

const demoApi = [
    {
        component: 'Badge',
        api: [
            {
                propName: 'content',
                type: `<code>string</code> | <code>number</code>`,
                default: `-`,
                desc: 'Content to show in badge',
            },
            {
                propName: 'maxCount',
                type: `<code>number</code>`,
                default: `<code>99</code>`,
                desc: 'Max number to show',
            },
            {
                propName: 'innerClass',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Class for badge inner',
            },
            {
                propName: 'badgeStyle',
                type: `<code>object</code>`,
                default: `-`,
                desc: 'Custom styling for Badge',
            },
        ],
    },
]

const Badge = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Badge
