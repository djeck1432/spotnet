import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'UseDarkModeDoc'

const demoHeader = {
    title: 'useDarkMode',
    desc: 'This hook helps to handles dark or light mode on the app.',
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

const extra = (
    <DemoComponentApi
        hideApiTitle
        keyText="return"
        api={[
            {
                api: [
                    {
                        propName: 'isDark',
                        type: `<code>boolean</code>`,
                        default: `-`,
                        desc: 'Whether the current mode is dark mode',
                    },
                    {
                        propName: 'setIsDark',
                        type: `<code>(mode: 'dark' | 'light') => void</code>`,
                        default: `-`,
                        desc: 'Mode setter',
                    },
                ],
            },
        ]}
    />
)

const UseDarkModeDoc = () => {
    return (
        <DemoLayout
            hideApiTitle
            hideFooter
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            mdPrefixPath="utils"
            extra={extra}
            keyText="param"
        />
    )
}

export default UseDarkModeDoc
