import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Offset from './Offset'

const mdPath = 'AffixDoc'

const demoHeader = {
    title: 'Affix',
    desc: 'Affix renders elemetns stick with a fixed position',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage`,
        component: <Basic />,
    },
    {
        mdName: 'Offset',
        mdPath: mdPath,
        title: 'Offset',
        desc: `with offset`,
        component: <Offset />,
    },
]

const demoApi = [
    {
        component: 'Affix',
        api: [
            {
                propName: 'offset',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Offset from the top of the viewport (px as unit) ',
            },
        ],
    },
]

const AffixDoc = () => {
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

export default AffixDoc
