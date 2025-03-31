import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'DeepParseJsonDoc/'

const demoHeader = {
    title: 'deepParseJson',
    desc: 'deepParseJson able to parse JSON string into javascript object, even nested or escaped.',
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
        component: 'deepParseJson',
        api: [
            {
                propName: 'jsonString',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'JSON string',
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
                        propName: 'parsedJsonString',
                        type: `<code>object</code>`,
                        default: `-`,
                        desc: 'Parsed JSON string',
                    },
                ],
            },
        ]}
    />
)

const DeepParseJsonDoc = () => {
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

export default DeepParseJsonDoc
