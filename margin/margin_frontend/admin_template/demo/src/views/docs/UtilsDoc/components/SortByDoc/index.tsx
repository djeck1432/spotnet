import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'SortByDoc/'

const demoHeader = {
    title: 'sortBy',
    desc: 'sortBy function able to sort array of object order with <code>array.sort</code> compare function by key.',
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
        component: 'sortBy',
        api: [
            {
                propName: 'field',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'key of the object that target to sort',
            },
            {
                propName: 'reverse',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Order of the result, <code>true</code> for descending, <code>false</code> for ascending',
            },
            {
                propName: 'primer',
                type: `<code>(key: string) => (key) => void</code>`,
                default: `-`,
                desc: 'Callback closure for key',
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
                        propName: 'result',
                        type: `<code>(a, b) => boolean</code>`,
                        default: `-`,
                        desc: 'Sort result callback',
                    },
                ],
            },
        ]}
    />
)

const SortByDoc = () => {
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

export default SortByDoc
