import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'UseMenuActiveDoc'

const demoHeader = {
    title: 'useMenuActive',
    desc: 'useMenuActive helps to get navigation meta related with current route.',
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
        component: 'useMenuActive',
        api: [
            {
                propName: 'navTree',
                type: `<code>NavConfigMeta[]</code>`,
                default: `-`,
                desc: 'Nav config tree',
            },
            {
                propName: 'key',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Current route key',
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
                        propName: 'activedRoute',
                        type: `<code>NavConfigMeta</code>`,
                        default: `-`,
                        desc: 'NavConfigMeta that paired with current route key',
                    },
                    {
                        propName: 'includedRouteTree',
                        type: `<code>NavConfigMeta</code>`,
                        default: `-`,
                        desc: 'Root NavConfigMeta tree that included current route key',
                    },
                ],
            },
        ]}
    />
)

const UseMenuActiveDoc = () => {
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

export default UseMenuActiveDoc
