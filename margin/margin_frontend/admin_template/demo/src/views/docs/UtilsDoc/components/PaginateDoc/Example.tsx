import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="js">{`import paginate from '@/utils/paginate'
        
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const data = paginate(arr, 3, 2)

// output: [4, 5, 6]
`}</SyntaxHighlighter>
    )
}

export default Example
