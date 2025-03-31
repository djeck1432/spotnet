import React from 'react'

import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'TextBlockSkeletonDoc'

const demoHeader = {
    title: 'TextBlockSkeleton',
    desc: 'TextBlockSkeleton is a combination of Skeleton component for display a loading state of text bloack.',
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
        component: 'TextBlockSkeleton',
        api: [
            {
                propName: 'height',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Thickness of the skeleton bar',
            },
            {
                propName: 'lastChildWidth',
                type: `<code>string</code> | <code>number</code>`,
                default: `<code>'60%'</code>`,
                desc: 'Width of the last skeleton bar',
            },
            {
                propName: 'rowCount',
                type: `<code>number</code>`,
                default: `<code>3</code>`,
                desc: 'Total skeleton bar rows to display',
            },
            {
                propName: 'title',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to display title skeleton bar',
            },
            {
                propName: 'titleWidth',
                type: `<code>string</code> | <code>number</code>`,
                default: `<code>'40%'</code>`,
                desc: 'Width of the title skeleton bar',
            },
        ],
    },
]

const TextBlockSkeletonDoc = () => {
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

export default TextBlockSkeletonDoc
