import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'WildCardSearchDoc'

const demoHeader = {
    title: 'wildCardSearch',
    desc: 'Wildcard search for array of object.',
}

const demos = [
    {
        mdName: 'Example',
        mdPath: mdPath,
        title: 'Example',
        desc: ``,
        component: <Example />,
    },
]

const demoApi = [
    {
        component: 'wildCardSearch',
        api: [
            {
                propName: 'list',
                type: `<code>Array&lt;T&gt;</code>`,
                default: `-`,
                desc: 'Array of object',
            },
            {
                propName: 'input',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Keyword',
            },
        ],
    },
]

const extra = (
    <DemoComponentApi
        hideApiTitle
        keyText="return"
        api={[
            {
                api: [
                    {
                        propName: 'result',
                        type: `<code>Array&lt;T&gt;</code>`,
                        default: `-`,
                        desc: 'Result array',
                    },
                ],
            },
        ]}
    />
)

const WildCardSearchDoc = () => {
    return (
        <DemoLayout
            hideApiTitle
            hideFooter
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            api={demoApi}
            mdPrefixPath="utils"
            extra={extra}
            keyText="param"
        />
    )
}

export default WildCardSearchDoc
