import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="js">{`import isLastChild from '@/utils/isLastChild'

const name = isLastChild([1, 2, 3, 4, 5], 4)

// output: true
`}</SyntaxHighlighter>
    )
}

export default Example
