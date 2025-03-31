import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'IconTextDoc'

const demoHeader = {
    title: 'IconText',
    desc: 'IconText is a component that helpt to aligns icons with text.',
}

const demos = [
    {
        mdName: 'Example',
        mdPath: mdPath,
        title: 'Example',
        desc: `Example usage`,
        component: <Example />,
    },
]

const demoApi = [
    {
        component: 'IconText',
        api: [
            {
                propName: 'asElement',
                type: `<code>string</code>`,
                default: `<code>'span'</code>`,
                desc: 'Render element',
            },
            {
                propName: 'icon',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Icon to display',
            },
        ],
    },
]

const IconTextDoc = () => {
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

export default IconTextDoc
