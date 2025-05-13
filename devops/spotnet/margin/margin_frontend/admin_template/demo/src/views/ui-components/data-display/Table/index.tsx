import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Simple from './Simple'
import Compact from './Compact'
import Sorting from './Sorting'
import Filtering from './Filtering'
import PaginationTable from './PaginationTable'
import Group from './Group'
import RowSelection from './RowSelection'
import Expanding from './Expanding'
import SubComponent from './SubComponent'
import Editable from './Editable'
import DragAndDrop from './DragAndDrop'
import Resizable from './Resizable'
// import VirtualizedRows from './VirtualizedRows'

const mdPath = 'Table'

const demoHeader = {
    title: 'Table',
    desc: 'Tables display data in rows and columns which make users compare and analyze information easier.',
}

const demos = [
    {
        mdName: 'Simple',
        mdPath: mdPath,
        title: 'Simple',
        desc: `Simple Table example.`,
        component: <Simple />,
    },
    {
        mdName: 'Compact',
        mdPath: mdPath,
        title: 'Compact',
        desc: `Table come with compact view which let us display more data.`,
        component: <Compact />,
    },
    {
        mdName: 'Sorting',
        mdPath: mdPath,
        title: 'Sorting',
        desc: `Columns can be sorted by selecting table headers`,
        component: <Sorting />,
    },
    {
        mdName: 'Filtering',
        mdPath: mdPath,
        title: 'Filtering',
        desc: `Filtering example.`,
        component: <Filtering />,
    },
    {
        mdName: 'PaginationTable',
        mdPath: mdPath,
        title: 'Pagination',
        desc: `Table can works with <a href="/ui-components/pagination" class="text-blue-500">Pagination</a> component.`,
        component: <PaginationTable />,
    },
    {
        mdName: 'Group',
        mdPath: mdPath,
        title: 'Group',
        desc: `Grouping example.`,
        component: <Group />,
    },
    {
        mdName: 'RowSelection',
        mdPath: mdPath,
        title: 'Row Selection',
        desc: `Row selection example.`,
        component: <RowSelection />,
    },
    {
        mdName: 'Expanding',
        mdPath: mdPath,
        title: 'Expanding',
        desc: `Row expand example.`,
        component: <Expanding />,
    },
    {
        mdName: 'SubComponent',
        mdPath: mdPath,
        title: 'SubComponent',
        desc: `Row expand with sub component`,
        component: <SubComponent />,
    },
    {
        mdName: 'Editable',
        mdPath: mdPath,
        title: 'Editable',
        desc: `Cell editable example`,
        component: <Editable />,
    },
    {
        mdName: 'DragAndDrop',
        mdPath: mdPath,
        title: 'Drag & Drop',
        desc: `Example of implementing <code>react-dnd</code> to the table.`,
        component: <DragAndDrop />,
    },
    {
        mdName: 'Resizable',
        mdPath: mdPath,
        title: 'Resizable',
        desc: `Column resize example.`,
        component: <Resizable />,
    },
    // {
    //     mdName: 'VirtualizedRows',
    //     mdPath: mdPath,
    //     title: 'Virtualized Rows',
    //     desc: `Example of implementing <code>react-window</code> for scrollable table body.`,
    //     component: <VirtualizedRows />,
    // },
]

const demoApi = [
    {
        component: 'Table',
        api: [
            {
                propName: 'asElement',
                type: `<code>string</code>`,
                default: `<code>'table'</code>`,
                desc: 'Render element',
            },
            {
                propName: 'borderlessRow',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to disable the row border in table',
            },
            {
                propName: 'compact',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether display table on compact view',
            },
            {
                propName: 'hoverable',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether table row able to hover',
            },
            {
                propName: 'overflow',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether allow table content overflow',
            },
        ],
    },
    {
        component: 'Table.THead',
        api: [
            {
                propName: 'asElement',
                type: `<code>string</code>`,
                default: `<code>'thead'</code>`,
                desc: 'Render element',
            },
        ],
    },
    {
        component: 'Table.TBody',
        api: [
            {
                propName: 'asElement',
                type: `<code>string</code>`,
                default: `<code>'tbody'</code>`,
                desc: 'Render element',
            },
        ],
    },
    {
        component: 'Table.TFoot',
        api: [
            {
                propName: 'asElement',
                type: `<code>string</code>`,
                default: `<code>'tfoot'</code>`,
                desc: 'Render element',
            },
        ],
    },
    {
        component: 'Table.Tr',
        api: [
            {
                propName: 'asElement',
                type: `<code>string</code>`,
                default: `<code>'tr'</code>`,
                desc: 'Render element',
            },
        ],
    },
    {
        component: 'Table.Th',
        api: [
            {
                propName: 'asElement',
                type: `<code>string</code>`,
                default: `<code>'th'</code>`,
                desc: 'Render element',
            },
        ],
    },
    {
        component: 'Table.Td',
        api: [
            {
                propName: 'asElement',
                type: `<code>string</code>`,
                default: `<code>'td'</code>`,
                desc: 'Render element',
            },
        ],
    },
    {
        component: 'Table.Sorter',
        api: [
            {
                propName: 'sort',
                type: `<code>false | 'asc' | 'desc'</code>`,
                default: `<code>-</code>`,
                desc: 'Sort status',
            },
        ],
    },
]

const reactTableApi = (
    <div className="demo-api-table mb-12">
        <h4 className="mb-5">Dependencies</h4>
        <h6 id="react-table-api" className="mb-3">
            React Table
        </h6>
        <p className="mb-1">
            Most of the examples above were integrated with{' '}
            <code>react-table</code>, its is lightweight and extensible data
            table component for materialize, filter, sort, group, aggregate,
            paginate and display massive data. Vist the{' '}
            <a
                className="underline text-blue-500"
                href="https://react-table.tanstack.com/docs/overview"
                target="_blank"
                rel="noopener noreferrer"
            >
                official docs
            </a>{' '}
            for futher examples & hooks usage.
        </p>
    </div>
)

const Table = () => {
    return (
        <DemoLayout
            header={demoHeader}
            demos={demos}
            api={demoApi}
            extra={reactTableApi}
        />
    )
}

export default Table
