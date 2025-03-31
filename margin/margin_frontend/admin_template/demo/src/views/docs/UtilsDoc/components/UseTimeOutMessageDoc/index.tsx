import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'UseTimeOutMessageDoc'

const demoHeader = {
    title: 'useTimeOutMessage',
    desc: 'useTimeOutMessage allow us to display message that disappear after a period of time.',
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

const demoApi = [
    {
        component: 'useTimeOutMessage',
        api: [
            {
                propName: 'interval',
                type: `<code>number</code>`,
                default: `<code>3000</code>`,
                desc: 'Time of message display',
            },
        ],
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
                        propName: 'message',
                        type: `<code>string</code>`,
                        default: `-`,
                        desc: 'Message string',
                    },
                    {
                        propName: 'setMessage',
                        type: `<code>string</code>`,
                        default: `-`,
                        desc: 'Message setter',
                    },
                ],
            },
        ]}
    />
)

const UseTimeOutMessageDoc = () => {
    return (
        <DemoLayout
            hideApiTitle
            hideFooter
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            api={demoApi}
            mdPrefixPath="utils"
            extra={extra}
            keyText="param"
        />
    )
}

export default UseTimeOutMessageDoc
