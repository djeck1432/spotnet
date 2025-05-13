import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Cover from './Cover'
import Custom from './Custom'

const mdPath = 'LoadingDoc'

const demoHeader = {
    title: 'Loading',
    desc: 'A component that provides state during loading.',
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
        mdName: 'Cover',
        mdPath: mdPath,
        title: 'Cover',
        desc: `You can overlay an element with <code>type="cover"</code>`,
        component: <Cover />,
    },
    {
        mdName: 'Custom',
        mdPath: mdPath,
        title: 'Custom',
        desc: `You can use any other custom element as loader by setting <code>customLoader</code> prop`,
        component: <Custom />,
    },
]

const demoApi = [
    {
        component: 'Loading',
        api: [
            {
                propName: 'asElement',
                type: `<code>string</code>`,
                default: `<code>'div'</code>`,
                desc: 'Render element',
            },
            {
                propName: 'customLoader',
                type: `<code>ReactNode</code>`,
                default: `-`,
                desc: 'Custom loader',
            },
            {
                propName: 'loading',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether is loading state',
            },
            {
                propName: 'spinnerClass',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Extra class for default spinner',
            },
        ],
    },
]

const LoadingDoc = () => {
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

export default LoadingDoc
