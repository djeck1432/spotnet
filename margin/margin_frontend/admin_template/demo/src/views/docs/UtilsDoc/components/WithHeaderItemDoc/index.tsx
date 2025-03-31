import React from 'react'

import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'WithHeaderItemDoc'

const demoHeader = {
    title: 'withHeaderItem',
    desc: 'withHeaderItem wrap component into a clickable option for header.',
}

const demos = [
    {
        mdName: 'Example',
        mdPath: mdPath,
        title: 'Example',
        desc: `Example usage.`,
        component: <Example />,
    },
]

const demoApi = [
    {
        component: 'withHeaderItem',
        api: [
            {
                propName: 'hoverable',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to make the item hoverable',
            },
        ],
    },
]

const WithHeaderItemDoc = () => {
    return (
        <DemoLayout
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            api={demoApi}
            mdPrefixPath="utils"
        />
    )
}

export default WithHeaderItemDoc
