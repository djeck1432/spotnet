import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'StickyFooterDoc'

const demoHeader = {
    title: 'StickyFooter',
    desc: 'StickyFooter allow element stick to bottom of a view port even where the content is not reached yet.',
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
        component: 'StickyFooter',
        api: [
            {
                propName: 'stickyClass',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Class to active while the component stick to the bottom',
            },
        ],
    },
]

const StickyFooterDoc = () => {
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

export default StickyFooterDoc
