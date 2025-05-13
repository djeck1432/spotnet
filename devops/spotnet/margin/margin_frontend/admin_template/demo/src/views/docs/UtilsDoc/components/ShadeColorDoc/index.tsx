import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'ShadeColorDoc/'

const demoHeader = {
    title: 'shadeColor',
    desc: 'With shareColor, you can get a ligther or darker color by input percentage.',
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
        component: 'shadeColor',
        api: [
            {
                propName: 'color',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Hex color',
            },
            {
                propName: 'percent',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Shade percentage',
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
                        propName: 'color',
                        type: `<code>string</code>`,
                        default: `-`,
                        desc: 'Output hex color',
                    },
                ],
            },
        ]}
    />
)

const ShadeColorDoc = () => {
    return (
        <DemoLayout
            hideApiTitle
            hideFooter
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            api={demoApi}
            mdPrefixPath="docs/SharedComponentsDoc/components"
            extra={extra}
            keyText="param"
        />
    )
}

export default ShadeColorDoc
