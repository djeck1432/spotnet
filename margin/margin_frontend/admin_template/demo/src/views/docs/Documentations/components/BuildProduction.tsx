import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const BuildProduction = () => {
    return (
        <>
            <p>
                Run the following command to build the application into{' '}
                <code>/build</code> directory
            </p>
            <SyntaxHighlighter language="js">{`npm run build`}</SyntaxHighlighter>
            <p>
                If you having issue about deployment, try to checkout the guide
                from vite official{' '}
                <a
                    rel="noopener noreferrer"
                    href="https://vitejs.dev/guide/build.html"
                    target="_blank"
                >
                    doc
                </a>
                .
            </p>
        </>
    )
}

export default BuildProduction
