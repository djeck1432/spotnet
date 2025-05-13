import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'UseQueryDoc'

const demoHeader = {
    title: 'useQuery',
    desc: 'useQuery created on top of <a class="text-indigo-600 underline" href="https://reactrouter.com/docs/en/v6/hooks/use-location" target="_blank"><code>useLocation</code></a> hook to parse the query string.',
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
                        propName: 'query',
                        type: `<a class="text-indigo-600 underline" href="https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams" target="_blank"><code>URLSearchParams</code></a>`,
                        default: `-`,
                        desc: 'A URLSearchParams instance with useLocation().search initialized ',
                    },
                ],
            },
        ]}
    />
)

const UseQueryDoc = () => {
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

export default UseQueryDoc
