import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'UseResponsiveDoc'

const demoHeader = {
    title: 'useResponsive',
    desc: 'A hooks for getting responsive information',
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
                        propName: 'larger',
                        type: `<code>{2xl: boolean, xl: boolean, lg: boolean, md: boolean, sm: boolean, xs: boolean}</code>`,
                        default: `-`,
                        desc: 'Breakpoints with statement that larger than current window width',
                    },
                    {
                        propName: 'smaller',
                        type: `<code>{2xl: boolean, xl: boolean, lg: boolean, md: boolean, sm: boolean, xs: boolean}</code>`,
                        default: `-`,
                        desc: 'Breakpoints with statement that smaller than current window width',
                    },
                    {
                        propName: 'windowWidth',
                        type: `<code>number</code>`,
                        default: `-`,
                        desc: 'Current window width',
                    },
                ],
            },
        ]}
    />
)

const UseResponsiveDoc = () => {
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

export default UseResponsiveDoc
