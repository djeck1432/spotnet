const Introduction = () => {
    return (
        <>
            <div id="introduction" className="mb-8">
                <p>
                    Elstar is a complete React admin template with developer
                    experience friendly & highly scalable, it comes with a
                    complete set of UI components meticulously crafted with
                    Tailwind CSS & React Hooks, it fulfilled most of the use
                    case to create modern and beautiful UI and application
                </p>
                <p>
                    Elstar offers several themes and layout options that allow
                    you to update the style of your application in no time, it
                    also supports dark theme & multiple locales including RTL
                    languages.
                </p>
                <p>
                    Elstar has built-in working functionality pages, routing
                    configuration, app configuration and auth features. It also
                    includes a lot of reusable bottom & upper-level components
                    which let you kickstart any project quickly.
                </p>
            </div>
            <div id="coreLibrary">
                <h4>Core libraries used</h4>
                <p>
                    Here is a list of some core libraries that we use in Elstar:
                </p>
                <ul>
                    <li>
                        <a
                            className="font-bold"
                            href="https://reactjs.org/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            React
                        </a>
                        <p className="mt-0">
                            A popular JavaScript library for building user
                            interfaces.
                        </p>
                    </li>
                    <li>
                        <a
                            className="font-bold"
                            href="https://www.typescriptlang.org/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            TypeScript
                        </a>
                        <p className="mt-0">
                            TypeScript is a strongly typed programming language
                            that builds on JavaScript
                        </p>
                    </li>
                    <li>
                        <a
                            className="font-bold"
                            href="https://vitejs.dev/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Vite
                        </a>
                        <p className="mt-0">
                            Vite is a modern, blazing-fast tool for scaffolding
                            and bundling
                        </p>
                    </li>
                    <li>
                        <a
                            className="font-bold"
                            href="https://tailwindcss.com/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            TailwindCSS
                        </a>
                        <p className="mt-0">
                            A utility-first CSS framework packed with classes.
                        </p>
                    </li>
                    <li>
                        <a
                            className="font-bold"
                            href="https://redux-toolkit.js.org/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Redux Toolkit
                        </a>
                        <p className="mt-0">
                            Redux Toolkit is package that help to write
                            Redux(State management tool) logic.{' '}
                        </p>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Introduction
