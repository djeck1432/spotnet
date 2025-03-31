import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'RichTextEditorDoc'

const demoHeader = {
    title: 'RichTextEditor',
    desc: 'A wrapper component of <a class="text-indigo-600 underline" href="https://github.com/VaguelySerious/react-quill#props" target="_blank">react-quill-new</a>',
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

const reactQuillApi = (
    <div className="demo-api-table mb-12">
        <h4 className="mb-5">Dependencies</h4>
        <h6 id="react-syntax-highlighter-api" className="mb-3">
            react-quill-new
        </h6>
        <p>
            All react-quill props can be applied on this component, refer{' '}
            <a
                className="underline text-indigo-600"
                href="https://github.com/zenoamaro/https://github.com/VaguelySerious/react-quill#props"
                target="_blank"
                rel="noreferrer"
            >
                official docs
            </a>{' '}
            for the complete api list.{' '}
        </p>
    </div>
)

const RichTextEditorDoc = () => {
    return (
        <DemoLayout
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            mdPrefixPath="shared"
            extra={reactQuillApi}
        />
    )
}

export default RichTextEditorDoc
