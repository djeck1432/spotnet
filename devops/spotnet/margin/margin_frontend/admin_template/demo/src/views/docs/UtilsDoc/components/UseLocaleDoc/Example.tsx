import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="js">{`import useLocale from '@/utils/hooks/useLocale'

const Component = () => {

	const locale = useDirection()

	return (...)
}
`}</SyntaxHighlighter>
    )
}

export default Example
