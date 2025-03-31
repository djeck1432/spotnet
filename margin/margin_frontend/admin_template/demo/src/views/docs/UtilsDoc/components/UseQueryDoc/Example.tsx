import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="js">{`import useQuery from '@/utils/hooks/useQuery'

const Component = () => {

    const query = useQuery()

    const id = query.get('queryKey')

	return (...)
}
`}</SyntaxHighlighter>
    )
}

export default Example
