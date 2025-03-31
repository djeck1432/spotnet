import React from 'react'

import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'UsersAvatarGroupDoc'

const demoHeader = {
    title: 'UsersAvatarGroup',
    desc: 'UsersAvatarGroup chain multiple users avatar into a stack, ',
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
        component: 'UsersAvatarGroup',
        api: [
            {
                propName: 'avatarGroupProps',
                type: `<a class="text-indigo-600 underline" href="/ui-components/avatar#api" target="_blank"><code>Avatar.GroupProps</code></a>`,
                default: `<code>{}</code>`,
                desc: 'Props for Avatar.Group',
            },
            {
                propName: 'avatarProps',
                type: `<a class="text-indigo-600 underline" href="/ui-components/avatar#api" target="_blank"><code>Avatar.GroupProps</code></a>`,
                default: `<code>{}</code>`,
                desc: 'Props for Avatar',
            },
            {
                propName: 'imgKey',
                type: `<code>string</code>`,
                default: `<code>'img'</code>`,
                desc: 'Property key to identify image source',
            },
            {
                propName: 'nameKey',
                type: `<code>string</code>`,
                default: `<code>'name'</code>`,
                desc: 'Property key to identify avatar name',
            },
            {
                propName: 'onAvatarClick',
                type: `<code>(data: UserDataObject) => void</code>`,
                default: `-`,
                desc: 'Property key to identify avatar name',
            },
            {
                propName: 'users',
                type: `<code>Array&lt;UserDataObject&gt;</code>`,
                default: `<code>[]</code>`,
                desc: 'Users data.',
            },
        ],
    },
]

const UsersAvatarGroupDoc = () => {
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

export default UsersAvatarGroupDoc
