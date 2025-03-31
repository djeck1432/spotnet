import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'PasswordInputDoc'

const demoHeader = {
    title: 'PasswordInput',
    desc: 'A password input component',
}

const demos = [
    {
        mdName: 'Example',
        mdPath: mdPath,
        title: 'Example',
        desc: `PasswordInput accepts all props from <a class="text-indigo-600 underline" href="/ui-components/input#api" target="_blank"><code>Input</code></a>`,
        component: <Example />,
    },
]

const demoApi = [
    {
        component: 'PasswordInput',
        api: [
            {
                propName: 'onVisibleChange',
                type: `<code>(visible:boolean) => void</code>`,
                default: `-`,
                desc: 'Callback when icon clicked',
            },
        ],
    },
]

const PasswordInputDoc = () => {
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
export default PasswordInputDoc
