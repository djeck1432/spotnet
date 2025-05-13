import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="js">{`import growShrinkColor from '@/utils/growShrinkColor'

const positive = growShrinkColor(1, 'bg') //output: 'bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-100'

const negative = growShrinkColor(-1, 'text') //output: 'text-red-600 dark:text-red-500'

`}</SyntaxHighlighter>
    )
}

export default Example
