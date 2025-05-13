import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'GrowShrinkTagDoc'

const demoHeader = {
    title: 'GrowShrinkTag',
    desc: 'GrowShrinkTag displays positive or negative status of a numeric value.',
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
        component: 'GrowShrinkTag',
        api: [
            {
                propName: 'showIcon',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to display up or down icon',
            },
            {
                propName: 'prefix',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Render a prefix content before the value',
            },
            {
                propName: 'suffix',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Render a suffix content next to the value',
            },
            {
                propName: 'value',
                type: `<code>number</code>`,
                default: `<code>0</code>`,
                desc: 'Tag value',
            },
        ],
    },
]

const GrowShrinkTagDoc = () => {
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

export default GrowShrinkTagDoc
