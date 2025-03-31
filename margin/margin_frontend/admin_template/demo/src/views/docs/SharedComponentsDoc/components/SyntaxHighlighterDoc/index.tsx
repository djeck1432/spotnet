import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'SyntaxHighlighterDoc'

const demoHeader = {
    title: 'SyntaxHighlighter',
    desc: 'This component is a wrapper of <a class="underline text-indigo-600" href="https://github.com/react-syntax-highlighter/react-syntax-highlighter" target="_blank">react-syntax-highlighter</a>.',
}

const demos = [
    {
        mdName: 'Example',
        mdPath: mdPath,
        title: 'Example',
        desc: `Example usage.`,
        component: <Example />,
    },
]

const reactSyntaxHighlighterApi = (
    <div className="demo-api-table mb-12">
        <h4 className="mb-5">Dependencies</h4>
        <h6 id="react-syntax-highlighter-api" className="mb-3">
            react-syntax-highlighter
        </h6>
        <p>
            All react-syntax-highlighter props can be applied on this component,
            refer{' '}
            <a
                className="underline text-indigo-600"
                href="https://github.com/react-syntax-highlighter/react-syntax-highlighter#props"
                target="_blank"
                rel="noreferrer"
            >
                official docs
            </a>{' '}
            for the complete api list.{' '}
        </p>
    </div>
)

const SyntaxHighlighterDoc = () => {
    return (
        <DemoLayout
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            mdPrefixPath="shared"
            extra={reactSyntaxHighlighterApi}
        />
    )
}

export default SyntaxHighlighterDoc
