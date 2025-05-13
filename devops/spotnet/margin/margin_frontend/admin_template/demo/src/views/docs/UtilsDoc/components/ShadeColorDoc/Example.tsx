import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="js">{`import shadeColor from '@/utils/shadeColor'

const color = shadeColor('#1f2db8', 30)

// output: '#283aef'
`}</SyntaxHighlighter>
    )
}

export default Example
