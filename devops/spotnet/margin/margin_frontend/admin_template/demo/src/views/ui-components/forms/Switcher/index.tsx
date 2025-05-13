import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Content from './Content'
import Disabled from './Disabled'
import Loading from './Loading'
import Colors from './Colors'
import Controlled from './Controlled'

const mdPath = 'Switcher'

const demoHeader = {
    title: 'Switcher',
    desc: 'Switcher component used as an alternative of the single Checkbox, it can be switch between enabled or disabled.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic example for Switcher.`,
        component: <Basic />,
    },
    {
        mdName: 'Content',
        mdPath: mdPath,
        title: 'Content',
        desc: `Switcher can have different content on state enabled or disabled`,
        component: <Content />,
    },
    {
        mdName: 'Disabled',
        mdPath: mdPath,
        title: 'Disabled',
        desc: `Set <code>disabled</code> to true to disable the Switcher.`,
        component: <Disabled />,
    },
    {
        mdName: 'Loading',
        mdPath: mdPath,
        title: 'Loading',
        desc: `We can set <code>isLoading</code> prop to true and make Switcher status to pending.`,
        component: <Loading />,
    },
    {
        mdName: 'Colors',
        mdPath: mdPath,
        title: 'Colors',
        desc: `We can apply custom color to Switcher via <code>color</code> prop.`,
        component: <Colors />,
    },
    {
        mdName: 'Controlled',
        mdPath: mdPath,
        title: 'Controlled',
        desc: `Controlled example.`,
        component: <Controlled />,
    },
]

const demoApi = [
    {
        component: 'Switcher',
        api: [
            {
                propName: 'checked',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether the Switcher is checked',
            },
            {
                propName: 'checkedContent',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Content to be shown when the state is checked',
            },
            {
                propName: 'color',
                type: `<code>string</code>`,
                default: 'current theme color',
                desc: 'Custom color for Switcher, available colors option based on tailwind <code>theme.colors</code>',
            },
            {
                propName: 'defaultChecked',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether the Switcher initial state is checked',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether the Switcher is disabled',
            },
            {
                propName: 'isLoading',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether the checkbox is loading',
            },
            {
                propName: 'labelRef',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Ref of Checkbox label element',
            },
            {
                propName: 'name',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'The name of the switcher input field',
            },
            {
                propName: 'onChange',
                type: `<code>(checked: boolean, e: MouseEvent) => void</code>`,
                default: `-`,
                desc: 'Callback when Switcher value is changed',
            },
            {
                propName: 'readOnly',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether the Switcher is read only',
            },
            {
                propName: 'unCheckedContent',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Content to be shown when the state is unchecked',
            },
        ],
    },
]

const Switcher = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Switcher
