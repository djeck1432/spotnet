import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import WithAvatar from './WithAvatar'

const mdPath = 'TableRowSkeletonDoc'

const demoHeader = {
    title: 'TableRowSkeleton',
    desc: 'TableRowSkeleton is a combination of Skeleton component for display a loading state of Table element.',
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
        mdName: 'WithAvatar',
        mdPath: mdPath,
        title: 'With avatar',
        desc: ``,
        component: <WithAvatar />,
    },
]

const demoApi = [
    {
        component: 'TableRowSkeleton',
        api: [
            {
                propName: 'avatarInColumns',
                type: `<code>number[]</code>`,
                default: `<code>[]</code>`,
                desc: 'Specify skeleton avatar display is which column',
            },
            {
                propName: 'avatarProps',
                type: `<a class="text-indigo-600 underline" href="/ui-components/skeleton#api" target="_blank"><code>SkeletonProps</code></a>`,
                default: `-`,
                desc: 'Props for avatar skeleton',
            },
            {
                propName: 'columns',
                type: `<code>number</code>`,
                default: `<code>1</code>`,
                desc: 'Count of the skeleton column',
            },
            {
                propName: 'rows',
                type: `<code>number</code>`,
                default: `<code>10</code>`,
                desc: 'Counts of the skeleton row',
            },
        ],
    },
]

const TableRowSkeletonDoc = () => {
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

export default TableRowSkeletonDoc
