import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Checkable from './Checkable'
import Query from './Query'

const mdPath = 'DataTableDoc'

const demoHeader = {
    title: 'DataTable',
    desc: 'DataTable is often used table logic encapsulated component, it can save up some boilerplate setup from <a class="text-indigo-600 underline" href="https://react-table-v7.tanstack.com/" target="_blank">react-table</a> & quick start with your async table data.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: ``,
        component: <Basic />,
    },
    {
        mdName: 'Checkable',
        mdPath: mdPath,
        title: 'Checkable',
        desc: ``,
        component: <Checkable />,
    },
    {
        mdName: 'Query',
        mdPath: mdPath,
        title: 'Query',
        desc: ``,
        component: <Query />,
    },
]

const demoApi = [
    {
        component: 'DataTable',
        api: [
            {
                propName: 'columns',
                type: `<a class="text-indigo-600 underline" href="https://tanstack.com/table/v8/docs/guide/column-defs" target="_blank"><code>Array&lt;Column&gt;</code></a>`,
                default: `<code>[]</code>`,
                desc: 'The core columns configuration object for the entire table',
            },
            {
                propName: 'data',
                type: `<code>Array&lt;any&gt;</code>`,
                default: `<code>[]</code>`,
                desc: 'The data array that you want to display on the table',
            },
            {
                propName: 'loading',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Wheter to display loading indicator on the table',
            },
            {
                propName: 'onCheckBoxChange',
                type: `<code>(checked: boolean, row: any) => void</code>`,
                default: `-`,
                desc: 'Callback when row checkbox is changed, return a checkbox value & changed row data',
            },
            {
                propName: 'onIndeterminateCheckBoxChange',
                type: `<code>(checked: boolean, rows: any) => void</code>`,
                default: `-`,
                desc: 'Callback when indeterminate checkbox is changed, return indeterminate checkbox value & all rows data',
            },
            {
                propName: 'onPaginationChange',
                type: `<code>(pageIndex: number) => void</code>`,
                default: `-`,
                desc: 'Callback when pagination changed',
            },
            {
                propName: 'onSelectChange',
                type: `<code>(pageSize: number) => void</code>`,
                default: `-`,
                desc: 'Callback when page size selector changed',
            },
            {
                propName: 'onSort',
                type: `<code>(pageSize: {order: 'desc' | 'asc', key: string}) => void</code>`,
                default: `-`,
                desc: 'Callback when any column of sorted changed, return sort order & sorted column identifier',
            },
            {
                propName: 'pageSizes',
                type: `<code>number[]</code>`,
                default: `<code>[10, 25, 50, 100]</code>`,
                desc: 'Options of selectable page sizes',
            },
            {
                propName: 'skeletonAvatarColumns',
                type: `<code>number[]</code>`,
                default: `-`,
                desc: 'Specify skeleton avatar display is which column when loading is true',
            },
            {
                propName: 'skeletonAvatarProps',
                type: `<a class="text-indigo-600 underline" href="/ui-components/avatar#api" target="_blank"><code>AvatarProps</code></a>`,
                default: `-`,
                desc: 'Props for skeleton avatar',
            },
            {
                propName: 'pagingData',
                type: `<code>{total: number, pageIndex: number, pageSize: number}</code>`,
                default: `<code>{total: 0, pageIndex: 1, pageSize: 10}</code>`,
                desc: 'Paging state of tthe table',
            },
        ],
    },
]

const DataTableDoc = () => {
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

export default DataTableDoc
