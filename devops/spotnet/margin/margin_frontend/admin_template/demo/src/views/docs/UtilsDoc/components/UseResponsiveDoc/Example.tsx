import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="js">{`import useResponsive from '@/utils/hooks/useResponsive'

const Component = () => {

    const { larger, smaller, windowWidth } = useResponsive()

	return (...)
}
`}</SyntaxHighlighter>
    )
}

export default Example
