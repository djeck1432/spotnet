import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'ContainerDoc'

const demoHeader = {
    title: 'Container',
    desc: 'Container is acomponent for fixing an elements width to the current breakpoint, it given a <code>max-width</code> to an element and match the <code>min-width</code> of the current breakpoint.',
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
        component: 'Container',
        api: [
            {
                propName: 'asElement',
                type: `<code>string</code>`,
                default: `<code>'div'</code>`,
                desc: 'Render element',
            },
        ],
    },
]

const ContainerDoc = () => {
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

export default ContainerDoc
