import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'PaginateDoc/'

const demoHeader = {
    title: 'paginate',
    desc: 'This function paginate an array according to page number & size.',
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
        component: 'paginate',
        api: [
            {
                propName: 'array',
                type: `<code>Array&lt;any&gt;</code>`,
                default: `-`,
                desc: 'Array that need to paginate',
            },
            {
                propName: 'pageSize',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Maximun element of the output array',
            },
            {
                propName: 'pageNumber',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Index that start from the array',
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
                        propName: 'paginatedData',
                        type: `<code>Array&lt;any&gt;</code>`,
                        default: `-`,
                        desc: 'End result',
                    },
                ],
            },
        ]}
    />
)

const PaginateDoc = () => {
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

export default PaginateDoc
