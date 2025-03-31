import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'EllipsisButtonDoc/'

const demoHeader = {
    title: 'EllipsisButton',
    desc: 'A higher level Button component with ellipsis icon, can be use as a dropdown trigger.',
}

const demos = [
    {
        mdName: 'Example',
        mdPath: mdPath,
        title: 'Example',
        desc: `Example usage with Dropdown component.`,
        component: <Example />,
    },
]

const demoApi = [
    {
        component: 'EllipsisButton',
        api: [
            {
                propName: 'variant',
                type: `<code>'solid'</code>  | <code>'twoTone'</code> | <code>'plain'</code> | <code>'default'</code>`,
                default: `<code>'plain'</code>`,
                desc: 'The variant of the button',
            },
            {
                propName: 'size',
                type: `<code>'lg'</code>  | <code>'md'</code> | <code>'sm'</code> | <code>'xs'</code>`,
                default: `<code>'xs'</code>`,
                desc: 'Size of the button.',
            },
            {
                propName: 'shape',
                type: `<code>'round'</code>  | <code>'circle'</code> | <code>'none'</code>`,
                default: `<code>'circle'</code>`,
                desc: 'Border radius of the button',
            },
        ],
    },
]

const EllipsisButtonDoc = () => {
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

export default EllipsisButtonDoc
