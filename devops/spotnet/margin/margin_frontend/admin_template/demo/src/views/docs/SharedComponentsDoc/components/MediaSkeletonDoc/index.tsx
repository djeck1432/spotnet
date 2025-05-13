import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Simple from './Simple'
import WithLoding from './WithLoding'

const mdPath = 'MediaSkeletonDoc'

const demoHeader = {
    title: 'MediaSkeleton',
    desc: 'MediaSkeleton is a combination of Skeleton component for display a loading state of a media like element.',
}

const demos = [
    {
        mdName: 'Simple',
        mdPath: mdPath,
        title: 'Simple',
        desc: `Basic usage.`,
        component: <Simple />,
    },
    {
        mdName: 'WithLoding',
        mdPath: mdPath,
        title: 'WithLoding',
        desc: `Usage with loading`,
        component: <WithLoding />,
    },
]

const demoApi = [
    {
        component: 'MediaSkeleton',
        api: [
            {
                propName: 'avatarProps',
                type: `<a class="text-indigo-600 underline" href="/ui-components/skeleton#api" target="_blank"><code>SkeletonProps</code></a>`,
                default: `-`,
                desc: 'Props for avatar skeleton',
            },
            {
                propName: 'showAvatar',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to display avatar skeleton',
            },
            {
                propName: 'textProps',
                type: `<a class="text-indigo-600 underline" href="/ui-components/skeleton#api" target="_blank"><code>SkeletonProps</code></a>`,
                default: `-`,
                desc: 'Props for text skeleton',
            },
            {
                propName: 'titleProps',
                type: `<a class="text-indigo-600 underline" href="/ui-components/skeleton#api" target="_blank"><code>SkeletonProps</code></a>`,
                default: `-`,
                desc: 'Props for title skeleton',
            },
        ],
    },
]

const MediaSkeletonDoc = () => {
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

export default MediaSkeletonDoc
