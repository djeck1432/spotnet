import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'UseThemeClassDoc'

const demoHeader = {
    title: 'useThemeClass',
    desc: 'useThemeClass helps to generate color related tailwind classes with current theme color.',
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
                        propName: 'textTheme',
                        type: `<code>'text-{currentThemeColor}-{currentColorLevel}'</code>`,
                        default: `-`,
                        desc: 'text color class',
                    },
                    {
                        propName: 'bgTheme',
                        type: `<code>'bg-{currentThemeColor}-{currentColorLevel}'</code>`,
                        default: `-`,
                        desc: 'background color class',
                    },
                    {
                        propName: 'borderTheme',
                        type: `<code>'border-{currentThemeColor}-{currentColorLevel}'</code>`,
                        default: `-`,
                        desc: 'border color class',
                    },
                    {
                        propName: 'ringTheme',
                        type: `<code>'ring-{currentThemeColor}-{currentColorLevel}'</code>`,
                        default: `-`,
                        desc: 'ring color class',
                    },
                ],
            },
        ]}
    />
)

const UseThemeClassDoc = () => {
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

export default UseThemeClassDoc
