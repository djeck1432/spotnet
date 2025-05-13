import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'SvgIconDoc'

const demoHeader = {
    title: 'SvgIcon',
    desc: 'A container component to display svg icon',
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

const SvgIconDoc = () => {
    return (
        <DemoLayout
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            mdPrefixPath="shared"
        />
    )
}

export default SvgIconDoc
