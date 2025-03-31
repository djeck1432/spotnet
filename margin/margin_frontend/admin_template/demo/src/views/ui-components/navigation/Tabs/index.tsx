import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Default from './Default'
import Icons from './Icons'
import Pill from './Pill'
import Disabled from './Disabled'
import ControlledTabs from './ControlledTabs'

const mdPath = 'Tabs'

const demoHeader = {
    title: 'Tabs',
    desc: 'Tabs help to organize related content in a single view which user make easy to explore and switch between different views.',
}

const demos = [
    {
        mdName: 'Default',
        mdPath: mdPath,
        title: 'Default',
        desc: `Default Tabs usage.`,
        component: <Default />,
    },
    {
        mdName: 'Pill',
        mdPath: mdPath,
        title: 'Pill',
        desc: `You can change the Tabs style by setting <code>variant</code> to pill.`,
        component: <Pill />,
    },
    {
        mdName: 'Icons',
        mdPath: mdPath,
        title: 'Icons',
        desc: `TabNav <code>icon</code> prop allow us to insert icon with auto spaced.`,
        component: <Icons />,
    },
    {
        mdName: 'Disabled',
        mdPath: mdPath,
        title: 'Disabled',
        desc: `Set <code>disabled</code> to TabNav prevent user execute click event.`,
        component: <Disabled />,
    },
    {
        mdName: 'ControlledTabs',
        mdPath: mdPath,
        title: 'Controlled Tabs',
        desc: `Example of controlled Tabs.`,
        component: <ControlledTabs />,
    },
]

const demoApi = [
    {
        component: 'Tabs',
        api: [
            {
                propName: 'defaultValue',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Initial value for uncontrolled Tabs',
            },
            {
                propName: 'onChange',
                type: `<code>(tabValue: string) => void</code>`,
                default: `-`,
                desc: 'Callback when Tab value is changed',
            },
            {
                propName: 'value',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Controlled value of the tab to activate',
            },
            {
                propName: 'variant',
                type: `<code>'underline'</code> | <code>'pill'</code>`,
                default: `-`,
                desc: 'Tabs style',
            },
        ],
    },
    {
        component: 'Tabs.TabList',
        api: [],
    },
    {
        component: 'Tabs.TabNav',
        api: [
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether to disable the tab',
            },
            {
                propName: 'icon',
                type: `<code>ReactNode</code> | <code>string</code>`,
                default: `-`,
                desc: 'Tab icon',
            },
            {
                propName: 'value(*)',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'An unique value matched with <code>TabContent</code>',
            },
        ],
    },
    {
        component: 'Tabs.TabContent',
        api: [
            {
                propName: 'value(*)',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'An unique value matched with <code>TabNav</code>',
            },
        ],
    },
]

const Tabs = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Tabs
