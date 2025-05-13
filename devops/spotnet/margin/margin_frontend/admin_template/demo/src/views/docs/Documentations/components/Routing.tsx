/* eslint-disable react/no-unescaped-entities */
import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'
import DemoComponentApi from '@/components/docs/DemoComponentApi'

const RouteAndNav = () => {
    return (
        <>
            <p>
                Elstar use{' '}
                <a
                    href="https://reactrouter.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    react-router
                </a>{' '}
                as base routing system. On this guide, you will find out how to
                create a new routes and how existing routes working.
            </p>
            <div className="mt-6" id="overview">
                <h5>Overview</h5>
                <p className="my-1">
                    You can find the template's router configuration in{' '}
                    <code>src/configs/routes.config/index.ts</code>, there's 2
                    type of route group as following.
                </p>
                <SyntaxHighlighter language="js">{`export const publicRoutes = [
    ...
]

export const protectedRoutes = [
    ...
]`}</SyntaxHighlighter>
                <ul>
                    <li>
                        <strong>publicRoutes</strong>
                        <p className="mt-1">
                            this routes group included all routes that open to
                            all users.
                        </p>
                    </li>
                    <li>
                        <strong>protectedRoutes</strong>
                        <p className="mt-1">
                            This routes group included all routes that required
                            authentication.
                        </p>
                    </li>
                </ul>
            </div>
            <div className="mt-10" id="addingNewRoute">
                <h5>Adding a new route</h5>
                <p className="mt-1">
                    You can add the following code to any of the routing groups,
                    depending on the authority you wish to.
                </p>
                <SyntaxHighlighter language="js">{`export const protectedRoutes = [
	{
        key: 'a-unique-id-for-this-view'
        path: 'my-new-view-path',
        component: lazy(() => import('@/views/MyNewComponent')),
        authority: [],
        meta: {
            pageContainerType: 'gutter'
        }
    },			
]`}</SyntaxHighlighter>
            </div>
            <div className="mt-10" id="authority">
                <h5>Authority</h5>
                <p className="mt-1">
                    Elstar routes comes with a simple role based access control,
                    you can set accessible roles as Array to{' '}
                    <code>authority</code> field. Taking following code as
                    example, the route only available for user who have either{' '}
                    <code>'admin'</code> or <code>'user'</code> in their
                    profile.
                    <br />
                    If your leave <code>authority</code> field as empty array,
                    the route will open to any roles to access.
                </p>
                <SyntaxHighlighter language="js">{`export const protectedRoutes = [
    {
        ...
        authority: ['admin', 'user'],
    },			
]`}</SyntaxHighlighter>
                <p>
                    In our default <code>AuthorityGuard</code>, it will check
                    the current user role from redux state (
                    <code>auth.user.authority</code>). You can use this as base
                    to extend or customize your access control.
                </p>
            </div>
            <div className="mt-10" id="authority">
                <h5>Meta</h5>
                <p className="mt-1">
                    <code>meta</code> field allow us to carry addtional
                    information to the <code>PageContainer</code> or the view
                    component under this route.
                </p>
                <SyntaxHighlighter language="js">{`export const protectedRoutes = [
    {
        ...
        meta: {
            pageContainerType: 'gutter',
            header: 'Page Title',
            headerContainer: false,
            extraHeader: lazy(() => import('SomeComponent')),
            footer: false,
            layout: 'blank',
        }
    },			
]`}</SyntaxHighlighter>
                <p>
                    The view component under this route will be able to receive
                    all the <code>meta</code> data above.
                </p>
                <DemoComponentApi
                    hideApiTitle
                    keyText="properties"
                    api={[
                        {
                            api: [
                                {
                                    propName: 'pageContainerType',
                                    type: `<code>'default'</code>  | <code>'gutterless'</code> | <code>'contained'</code>`,
                                    default: `<code>'default'</code>`,
                                    desc: 'Type of the view container',
                                },
                                {
                                    propName: 'header',
                                    type: `<code>string</code>  | <code>object</code>`,
                                    default: '-',
                                    desc: 'View page title or custom element',
                                },
                                {
                                    propName: 'headerContainer',
                                    type: `<code>boolean</code>`,
                                    default: '-',
                                    desc: 'Whether to enable header container',
                                },
                                {
                                    propName: 'extraHeader',
                                    type: `<code>string</code>  | <code>object</code>`,
                                    default: '-',
                                    desc: 'Apply a custom element on the opposite of header',
                                },
                                {
                                    propName: 'footer',
                                    type: `<code>boolean</code>`,
                                    default: `<code>true</code>`,
                                    desc: 'Whether to display footer',
                                },
                                {
                                    propName: 'layout',
                                    type: `<code>'blank'</code>  | <code>'classic'</code> | <code>'modern'</code> | <code>'simple'</code> | <code>'decked'</code> | <code>'stackedSide'</code>`,
                                    default: `-`,
                                    desc: 'Overiding current layout for this page',
                                },
                            ],
                        },
                    ]}
                />
            </div>
        </>
    )
}

export default RouteAndNav
