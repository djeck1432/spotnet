import React from 'react'

import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'SegmentItemOptionDoc'

const demoHeader = {
    title: 'SegmentItemOption',
    desc: 'A premade custom option use for Segment component.',
}

const demos = [
    {
        mdName: 'Example',
        mdPath: mdPath,
        title: 'Example',
        desc: `Example usage`,
        component: <Example />,
    },
]

const demoApi = [
    {
        component: 'SegmentItemOption',
        api: [
            {
                propName: 'active',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether this option is active',
            },
            {
                propName: 'customCheck',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Display a custom check when active is true',
            },
            {
                propName: 'defaultGutter',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to use default spacer',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether to disabled this option',
            },
            {
                propName: 'hoverable',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether to disabled hover effect',
            },
            {
                propName: 'onSegmentItemClick',
                type: `<code>() => void</code>`,
                default: `-`,
                desc: 'Callback when this option clicked',
            },
        ],
    },
]

const SegmentItemOptionDoc = () => {
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

export default SegmentItemOptionDoc
