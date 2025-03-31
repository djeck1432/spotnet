import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'TextEllipsisDoc'

const demoHeader = {
    title: 'TextEllipsis',
    desc: 'TextEllipsis component allow text trucate by the defined max text count.',
}

const demos = [
    {
        mdName: 'Example',
        mdPath: mdPath,
        title: 'Example',
        desc: `Example usage.`,
        component: <Example />,
    },
]

const demoApi = [
    {
        component: 'TextEllipsis',
        api: [
            {
                propName: 'maxTextCount',
                type: `<code>number</code>`,
                default: `<code>0</code>`,
                desc: 'Maximum text count',
            },
            {
                propName: 'text',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Text string',
            },
        ],
    },
]

const TextEllipsisDoc = () => {
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

export default TextEllipsisDoc
