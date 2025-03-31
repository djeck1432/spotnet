import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'UseAuthDoc/'

const demoHeader = {
    title: 'useAuth',
    desc: 'A hook that enables any component to get the current auth state.',
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
                        propName: 'authenticated',
                        type: `<code>boolean</code>`,
                        default: `-`,
                        desc: 'State of current authencation',
                    },
                    {
                        propName: 'signIn',
                        type: `<code>({userName: string, password: string}) => ({status: 'success' | 'failed', message: string})</code>`,
                        default: `-`,
                        desc: 'Sign in handler, return status & message as result',
                    },
                    {
                        propName: 'signOut',
                        type: `<code>() => void</code>`,
                        default: `-`,
                        desc: 'Sign out handler',
                    },
                ],
            },
        ]}
    />
)

const UseAuthDoc = () => {
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

export default UseAuthDoc
