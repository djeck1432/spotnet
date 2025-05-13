import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const TypeScript = () => {
    return (
        <>
            <p>
                This guide will walk you through the process of configuring
                TypeScript settings and leveraging its features in Elsatr.
                Developed entirely in TypeScript, Elstar allowing you to write
                type-safe and scalable code building modern web applications
                with ease.
            </p>
            <div className="mt-10" id="ts-config">
                <h5>Configuring TypeScript Settings</h5>
                <p>
                    The configuration of typescript plays a crucial role in
                    TypeScript projects. It allows you to define and customize
                    various compiler options to fit your project&apos;s
                    requirements, you can tweak the config via{' '}
                    <code>tsconfig.json</code>
                </p>
            </div>
            <div className="mt-10" id="ts-config">
                <h5>Configuring TypeScript Settings</h5>
                <p>
                    We understand that not everyone may be comfortable with
                    TypeScript&apos;s strict type checking. To cater to
                    developers who prefer a more JavaScript-like experience,
                    Typescript allows you to configure weak type checking
                </p>
                <p>
                    Here&apos;s an example tsconfig.json configuration for weak
                    type checking:
                </p>
                <SyntaxHighlighter language="json">{`{
  "compilerOptions": {
    "strict": false,
    ...
  }
}`}</SyntaxHighlighter>
                <p>
                    This configuration enables weak type checking, allowing you
                    to write code that feels closer to JavaScript.
                </p>
            </div>
        </>
    )
}

export default TypeScript
