import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'AcronymDoc'

const demoHeader = {
    title: 'acronym',
    desc: 'Fuction to get acronym from a name string.',
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
        component: 'acronym',
        api: [
            {
                propName: 'name',
                type: `<code>string</code>`,
                default: `<code>''</code>`,
                desc: 'Name string',
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
                        propName: 'acronym',
                        type: `<code>string</code>`,
                        default: `-`,
                        desc: 'Acronym',
                    },
                ],
            },
        ]}
    />
)

const AcronymDoc = () => {
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

export default AcronymDoc
