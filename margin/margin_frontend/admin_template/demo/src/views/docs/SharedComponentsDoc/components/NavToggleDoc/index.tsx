import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'NavToggleDoc'

const demoHeader = {
    title: 'NavToggle',
    desc: 'NavToggle component designed as a toggler for expandable or side navigation.',
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
        component: 'NavToggle',
        api: [
            {
                propName: 'toggled',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'State of NavToggle',
            },
        ],
    },
]

const NavToggleDoc = () => {
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

export default NavToggleDoc
