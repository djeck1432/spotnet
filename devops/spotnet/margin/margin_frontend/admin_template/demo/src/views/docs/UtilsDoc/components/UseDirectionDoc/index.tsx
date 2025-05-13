import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'
// Demo
import Example from './Example'

const mdPath = 'UseDirectionDoc/'

const demoHeader = {
    title: 'useDirection',
    desc: 'This hook helps to handles direction state of the app.',
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
                        propName: 'direction',
                        type: `<code>'ltr'</code> | <code>'rtl'</code>`,
                        default: `-`,
                        desc: 'Current direction state',
                    },
                    {
                        propName: 'updateDirection',
                        type: `<code>(direction: 'ltr' | 'rtl') => void</code>`,
                        default: `-`,
                        desc: 'Direction setter',
                    },
                ],
            },
        ]}
    />
)

const UseDirectionDoc = () => {
    return (
        <DemoLayout
            hideApiTitle
            hideFooter
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            mdPrefixPath="docs/SharedComponentsDoc/components"
            extra={extra}
            keyText="param"
        />
    )
}

export default UseDirectionDoc
