import Alert from '@/components/ui/Alert'
import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const TailwindCss = () => {
    return (
        <>
            <p>
                Tailwind CSS is a utility-first CSS framework with predefined
                classes that you can use to build and design the UI directly in
                the JSX. We use Tailwind as our core CSS framework, most of the
                UI in Elstar is built entirely with it features, so you can
                easily update the theme & base by altering{' '}
                <code>tailwind.config.cjs</code> under the root directory.
            </p>
            <div className="mt-10" id="tooling">
                <h5>Tooling</h5>
                <p className="mt-1">
                    If you are using VS Code as your IDE, we suggest to install{' '}
                    <a
                        href="https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss"
                        rel="noreferrer"
                        target="_blank"
                    >
                        Tailwind CSS IntelliSense
                    </a>{' '}
                    plugin, it provides autocomplete, syntax highlighting, and
                    linting based on your Tailwind config which can speed up
                    your development.
                </p>
            </div>
            <div className="mt-10" id="note">
                <Alert showIcon type="info" title="Note">
                    Some of our UI component use sematic class with tailwind{' '}
                    <code>@apply</code> directive underlying, in some cases,
                    applying tailwind classes on these component might not
                    working, you might need to use <code>!important</code>{' '}
                    modifier to override the default high specificity selectors.
                </Alert>
            </div>
            <p>
                You can make any utility important by adding a ! character to
                the beginning, E.g:
            </p>
            <SyntaxHighlighter language="jsx">{`<Dropdown className="!bg-red-500" />`}</SyntaxHighlighter>
            <p>
                You can always visit the official doc to find out classes usage
                & Tailwind configuration:{' '}
                <a
                    href="https://tailwindcss.com/"
                    rel="noreferrer"
                    target="_blank"
                >
                    https://tailwindcss.com/
                </a>
            </p>

            <div className="mt-10" id="tooling">
                <h5>Safelist</h5>
                <p className="mt-1">
                    By default, our tailwind configuration includes every color
                    in CSS in order to accommodate dynamic theming. However, if
                    your application only needs a single theme color, you can
                    simply replace the value of <code>SAFELIST_COLORS</code> in
                    the tailwind.config.cjs file with your desired theme color,
                    using the <code>colors.</code> prefix. This will ensure that
                    only your chosen theme color is included in the safelist.
                    E.g
                </p>
                <SyntaxHighlighter language="ts">{`const SAFELIST_COLORS = 'colors.cyan'`}</SyntaxHighlighter>
            </div>
        </>
    )
}

export default TailwindCss
