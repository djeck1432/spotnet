import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const ThemeColor = () => {
    return (
        <>
            <p>
                To config the app theme color, you can visit{' '}
                <code>src/configs/theme.config.ts</code> changing the{' '}
                <code>themeColor</code> & <code>primaryColorLevel</code> field
                based on{' '}
                <a
                    href="https://tailwindcss.com/docs/customizing-colors"
                    rel="noreferrer"
                    target="_blank"
                >
                    tailwind preset color palette
                </a>
                .
            </p>
            <SyntaxHighlighter language="ts">{`export const themeConfig = {
    themeColor: 'rose',
    primaryColorLevel: 500,
    ...
}
`}</SyntaxHighlighter>
            <p>
                In general, all all{' '}
                <a
                    href="https://tailwindcss.com/docs/customizing-colors"
                    rel="noreferrer"
                    target="_blank"
                >
                    tailwind preset color palette
                </a>{' '}
                can be applied to the themeConfig, but since not all colors are
                suitable for the template, we recommend keeping the{' '}
                <code>primaryColorLevel</code> within the range of 400 to 900
                and avoiding gray like colors.
            </p>
        </>
    )
}

export default ThemeColor
