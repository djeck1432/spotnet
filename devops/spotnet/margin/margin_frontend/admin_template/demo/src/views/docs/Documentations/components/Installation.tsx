import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Installation = () => {
    return (
        <>
            <h6>Prerequisites</h6>
            <p>
                Before you begin with Elstar, you may need to install the
                following tools make sure your development environment able to
                run the template.
            </p>
            <div className="mt-6">
                <ul>
                    <li>
                        <a
                            href="https://nodejs.org"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Node.js
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://www.npmjs.com/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            npm
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://yarnpkg.com/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Yarn
                        </a>{' '}
                        (optional)
                    </li>
                </ul>
            </div>
            <div className="mt-8">
                <h6>Installing Elstar</h6>
                <p>
                    Once have you uncompressed the .zip file you have
                    downloaded, you will find 4 folder as below:
                </p>
                <ul>
                    <li>
                        <strong>demo</strong>
                        <p className="mt-1">
                            Demo is the main preview project, it included
                            everything that can see in the live demo. This
                            package is just for reference only, we do{' '}
                            <strong>
                                <em>not</em>
                            </strong>{' '}
                            recommend using this version to build your app.
                        </p>
                    </li>
                    <li>
                        <strong>starter</strong>
                        <p className="mt-1">
                            This is a starter pack for developer, it initialize
                            the basic of the template. You can create pages and
                            write your own code here, we highly recommend you
                            copy this folder to your workspace for development.
                        </p>
                    </li>
                    <li>
                        <strong>documentation</strong>
                        <p className="mt-1">
                            This folder contain a index.html that redirect to
                            our online documentation.
                        </p>
                    </li>
                    <li>
                        <strong>legacy</strong>
                        <p className="mt-1">
                            Legacy 1.0 version that build with JavaScript &
                            create-react-app, please note that this package is
                            no longer being maintained and will be removed in
                            the next major update.
                        </p>
                    </li>
                </ul>
                <p>
                    After choosing the package you want to install, navigate to
                    project root directory, where the <code>package.json</code>{' '}
                    located and run the command below in console:
                </p>
                <SyntaxHighlighter>npm i</SyntaxHighlighter>
                or
                <SyntaxHighlighter>yarn install</SyntaxHighlighter>
                <p>
                    This will take some time and install all necessary
                    dependencies into the node_modules directory in order for
                    you to start developing.
                </p>
            </div>
        </>
    )
}

export default Installation
