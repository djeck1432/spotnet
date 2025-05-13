import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import ThemeColor from './ThemeColor'
import Hyperlink from './Hyperlink'

const mdPath = 'ActionLinkDoc'

const demoHeader = {
    title: 'ActionLink',
    desc: 'ActionLink lets the user navigate to another page by clicking or tapping on it.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage.`,
        component: <Basic />,
    },
    {
        mdName: 'ThemeColor',
        mdPath: mdPath,
        title: 'Theme color',
        desc: `You can disable the default theme color applied to the ActionLink by setting <code>themeColor</code> to false.`,
        component: <ThemeColor />,
    },
    {
        mdName: 'Hyperlink',
        mdPath: mdPath,
        title: 'Hyperlink',
        desc: `You can use ActionLink as hyperlink as well without using <code>to</code> props to define the destination.`,
        component: <Hyperlink />,
    },
]

const demoApi = [
    {
        component: 'ActionLink',
        api: [
            {
                propName: 'replace',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'When true, clicking the link will replace the current entry in the history stack instead of adding a new one',
            },
            {
                propName: 'state',
                type: `<code>any</code>`,
                default: `-`,
                desc: 'State to persist to the location as <code>Link</code> component in <code>react-router</code>',
            },
            {
                propName: 'themeColor',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to apply theme color on this link',
            },
            {
                propName: 'to',
                type: `<code>string</code> | <code>{pathName: string, search: string, hash: string}</code>`,
                default: `-`,
                desc: 'Describes a location that is the destination of some navigation',
            },
        ],
    },
]

const ActionLinkDoc = () => {
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

export default ActionLinkDoc
