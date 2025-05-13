import Markdown from 'react-markdown'
import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const CodeBox = (props: { markdown: string }) => {
    const { markdown } = props

    return (
        <Markdown
            components={{
                code: (props) => (
                    <SyntaxHighlighter className="text-base" language="jsx">
                        {props.children as string}
                    </SyntaxHighlighter>
                ),
            }}
        >
            {markdown}
        </Markdown>
    )
}

export default CodeBox
