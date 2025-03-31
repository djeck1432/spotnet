import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'

const mdPath = 'AdaptableCardDoc'

const demoHeader = {
    title: 'AdaptableCard',
    desc: 'A card component that can adapt on different layout & background.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: ``,
        component: <Basic />,
    },
]

const demoApi = [
    {
        component: 'AdaptableCard',
        api: [
            {
                propName: 'divider',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether to display divider at bottom in mordern layout',
            },
            {
                propName: 'isLastChild',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Disable divider when it is true',
            },
            {
                propName: 'leftSideBorder',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether to display left side border in mordern layout',
            },
            {
                propName: 'rightSideBorder',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether to display right side border in mordern layout',
            },
            {
                propName: 'shadow',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether display shadow except mordern layout',
            },
        ],
    },
]

const AdaptableCardDoc = () => {
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

export default AdaptableCardDoc
