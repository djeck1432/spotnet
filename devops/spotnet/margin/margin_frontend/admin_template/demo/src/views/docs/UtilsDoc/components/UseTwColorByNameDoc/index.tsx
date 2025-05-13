import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'UseTwColorByNameDoc'

const demoHeader = {
    title: 'useTwColorByName',
    desc: 'useTwColorByName hook provide a random tailwind utilities color class generator according to the input string.',
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
        component: 'useTwColorByName',
        api: [
            {
                propName: 'prefix',
                type: `<code>string</code>`,
                default: `<code>'bg'</code>`,
                desc: 'Prefix for tailwind color classes',
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
                        propName: 'generateTwColor',
                        type: `<code>(name: string) => string</code>`,
                        default: `-`,
                        desc: 'Generated a tailwind color class based on inputted param on hook & generateTwColor',
                    },
                ],
            },
        ]}
    />
)

const UseTwColorByNameDoc = () => {
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

export default UseTwColorByNameDoc
