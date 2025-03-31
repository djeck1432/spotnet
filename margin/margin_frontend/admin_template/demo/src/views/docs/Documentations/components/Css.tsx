import React from 'react'
import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Css = () => {
    return (
        <>
            <p>
                Although we have been using TailwindCss, we also have some
                underlying styling that is written in the css, which located at{' '}
                <code>src/assets/styles/*</code>. Due to some dependencies of
                tailwind, we are using Postcss as our preprocessor.
            </p>
            <p>This is our styles folder structure</p>
            <SyntaxHighlighter>
                {`├── styles                     
|   ├── components               # base ui components related styles
|   ├── docs                     # docs components related styles
|   ├── tailwind                 # tailwind entry & base style
|   ├── template                 # template components related styles
|   └── index.css                # entry css
`}
            </SyntaxHighlighter>
            <p>
                Every folders inside <code>styles</code> directory contain an{' '}
                <code>index.css</code> that will carry all other css files under
                the same directory and all these <code>index.css</code>will
                eventually import into the entry css.
            </p>
            <div className="mt-10" id="writingCss">
                <h5>Custom Css</h5>
                <p className="mt-1">
                    If in some cases tailwind is unable to meet your needs, you
                    can add your custom css under this folder. We suggest to
                    utilize functions & directives provided by tailwind while
                    adding a custom css, such as <code>@apply</code>,{' '}
                    <code>@layer</code>, <code>theme()</code> & etc.
                </p>
                <p>
                    You can refer to the{' '}
                    <a
                        href="https://tailwindcss.com/docs/functions-and-directives"
                        target="_blank"
                        rel="noreferrer"
                    >
                        official documentation
                    </a>{' '}
                    for further information & usage.
                </p>
            </div>
        </>
    )
}

export default Css
