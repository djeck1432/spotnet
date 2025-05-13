import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'GrowShrinkColorDoc'

const demoHeader = {
    title: 'growShrinkColor',
    desc: 'growShrinkColor generated grow shrink status color css class for text or background.',
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
        component: 'growShrinkColor',
        api: [
            {
                propName: 'value',
                type: `<code>number</code>`,
                default: ``,
                desc: 'Number value',
            },
            {
                propName: 'type',
                type: `<code>'bg'</code> | <code>'type'</code>`,
                default: `<code>'bg'</code> `,
                desc: 'Class for text or background',
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
                        propName: 'class',
                        type: `<code>string</code>`,
                        default: `-`,
                        desc: 'Output tailwind css class',
                    },
                ],
            },
        ]}
    />
)

const GrowShrinkColorDoc = () => {
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

export default GrowShrinkColorDoc
