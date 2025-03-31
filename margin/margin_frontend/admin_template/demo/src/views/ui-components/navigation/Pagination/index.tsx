import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import More from './More'
import Total from './Total'
import PageSize from './PageSize'
import Controlled from './Controlled'

const mdPath = 'Pagination'

const demoHeader = {
    title: 'Pagination',
    desc: 'Pagination divided content into several pages and allows users to navigate in between.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of Pagination.`,
        component: <Basic />,
    },
    {
        mdName: 'More',
        mdPath: mdPath,
        title: 'More',
        desc: `Pagination will diaplay ellipsis for indicating previous or continuing results when the page amount is overflow.`,
        component: <More />,
    },
    {
        mdName: 'Total',
        mdPath: mdPath,
        title: 'Total',
        desc: `Display total number of data by setting <code>displayTotal</code> to true.`,
        component: <Total />,
    },
    {
        mdName: 'PageSize',
        mdPath: mdPath,
        title: 'Page sizes',
        desc: `Displaying the pagination count divided by <code>total</code> & <code>pageSize</code>, often used on displaying numbers of data in a page. `,
        component: <PageSize />,
    },
    {
        mdName: 'Controlled',
        mdPath: mdPath,
        title: 'Controlled',
        desc: `Example of controlled pagination.`,
        component: <Controlled />,
    },
]

const demoApi = [
    {
        component: 'Pagination',
        api: [
            {
                propName: 'currentPage',
                type: `<code>number</code>`,
                default: `<code>1</code>`,
                desc: 'Current page number',
            },
            {
                propName: 'displayTotal',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to display total of data items',
            },
            {
                propName: 'onChange',
                type: `<code>(pageNumber: number) => void</code>`,
                default: `<code>-</code>`,
                desc: 'Callback when Pagination index was clicked',
            },
            {
                propName: 'pageSize',
                type: `<code>number</code>`,
                default: `<code>1</code>`,
                desc: 'Number of data items per page',
            },
            {
                propName: 'total',
                type: `<code>number</code>`,
                default: `<code>5</code>`,
                desc: 'Total number of data items',
            },
        ],
    },
]

const Pagination = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Pagination
