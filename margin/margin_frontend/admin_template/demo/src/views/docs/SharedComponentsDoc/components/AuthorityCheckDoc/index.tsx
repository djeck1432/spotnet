import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'AuthorityCheckDoc'

const demoHeader = {
    title: 'AuthorityCheck',
    desc: 'AuthorityCheck component help to check whether the current user has permmision to access, it can be use to display or hide some elements that require permmission by certain roles.',
}

const demos = [
    {
        mdName: 'Example',
        mdPath: mdPath,
        title: 'Example',
        desc: `example usage`,
        component: <Example />,
    },
]

const demoApi = [
    {
        component: 'AuthorityCheck',
        api: [
            {
                propName: 'authority',
                type: `<code>Array</code>`,
                default: `<code>[]</code>`,
                desc: 'List of roles that have rights to access the wrapped elements',
            },
            {
                propName: 'userAuthority',
                type: `<code>Array</code>`,
                default: `<code>[]</code>`,
                desc: 'List of the user roles',
            },
        ],
    },
]

const AuthorityCheckDoc = () => {
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

export default AuthorityCheckDoc
