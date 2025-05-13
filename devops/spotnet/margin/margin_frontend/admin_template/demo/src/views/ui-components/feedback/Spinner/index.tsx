import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Size from './Size'
import Color from './Color'
import CustomIndicator from './CustomIndicator'
import Static from './Static'

const mdPath = 'Spinner'

const demoHeader = {
    title: 'Spinner',
    desc: 'Spinner indicate the loading state of a component or page, it can help to the user aware and that the data is processing.',
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
        mdName: 'Size',
        mdPath: mdPath,
        title: 'Size',
        desc: `We can configure the Spinner size on <code>size</code> prop. `,
        component: <Size />,
    },
    {
        mdName: 'Color',
        mdPath: mdPath,
        title: 'Color',
        desc: `Spinner offer <code>color</code> prop like some others component, available colors option based on tailwind <code>theme.colors</code>.`,
        component: <Color />,
    },
    {
        mdName: 'CustomIndicator',
        mdPath: mdPath,
        title: 'Custom Indicator',
        desc: `If you don't fancy the default spinner, you can replace it with your own spinner instead.`,
        component: <CustomIndicator />,
    },
    {
        mdName: 'Static',
        mdPath: mdPath,
        title: 'Static',
        desc: `Stop the spining animation by setting <code>isSpining</code> to false.`,
        component: <Static />,
    },
]

const demoApi = [
    {
        component: 'Spinner',
        api: [
            {
                propName: 'color',
                type: `<code>string</code>`,
                default: 'current theme color',
                desc: 'Custom color for Spinner, available colors option based on tailwind <code>theme.colors</code>',
            },
            {
                propName: 'enableTheme',
                type: `<code>boolean</code>`,
                default: '<code>true</code>',
                desc: 'Wheter the Spinner inherit theme color',
            },
            {
                propName: 'indicator',
                type: `<code>ReactNode</code>`,
                default: '<code>CgSpinner</code>',
                desc: 'Spinner indicator',
            },
            {
                propName: 'isSpining',
                type: `<code>boolean</code>`,
                default: '<code>true</code>',
                desc: 'Wheter the Spinner is spinning',
            },
            {
                propName: 'size',
                type: `<code>string</code> | <code>number</code>`,
                default: '<code>20</code>',
                desc: 'Size of Spinner',
            },
        ],
    },
]

const Spinner = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Spinner
