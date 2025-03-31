import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'
import { NavLink } from 'react-router-dom'

const RouteAndNav = () => {
    return (
        <>
            <p>
                As we mentioned in{' '}
                <NavLink to="/docs/documentation/installation">
                    Installation
                </NavLink>
                , we have provided a starter version with minimum core
                components and functionality setup, we strongly recommend
                developer use this version to build the app on top.
            </p>
            <p>
                When you have opened the starter pack in your local environment,
                you will be redirected to the login page, where you can use{' '}
                <i>user: admin | password: 123Qwe</i> this credential to sign
                in.
            </p>
            <i>
                Note: the starter version enabled mock api by default, every api
                calls will point to the mock server, if you wish to disable or
                know more about the mock api, visit{' '}
                <NavLink to="/docs/documentation/mock-api">Mock API</NavLink>{' '}
                doc.
            </i>
            <div className="mt-10" id="defaultConfig">
                <h5>Default configs</h5>
                <p>
                    Here are some default configurations for the starter
                    version, you can change the config according to your needs.
                </p>
                <p className="mb-2">
                    AppConfig -{' '}
                    <NavLink to="/docs/documentation/app">Doc</NavLink>
                </p>
                <SyntaxHighlighter language="js">{`const appConfig: AppConfig = {
    apiPrefix: '/api',
    authenticatedEntryPath: '/app/sales/dashboard',
    unAuthenticatedEntryPath: '/sign-in',
    tourPath: '/app/account/kyc-form',
    locale: 'en',
    enableMock: true,
}
`}</SyntaxHighlighter>
                <p className="mb-2">
                    ThemeConfig -{' '}
                    <NavLink to="/docs/documentation/overall-theme-config">
                        Doc
                    </NavLink>
                </p>
                <SyntaxHighlighter language="js">{`export const themeConfig: ThemeConfig = {
    themeColor: 'indigo',
    direction: THEME_ENUM.DIR_LTR,
    mode: THEME_ENUM.MODE_LIGHT,
    primaryColorLevel: 600,
    cardBordered: true,
    panelExpand: false,
    controlSize: 'md',
    navMode: THEME_ENUM.NAV_MODE_LIGHT,
    layout: {
        type: THEME_ENUM.LAYOUT_TYPE_MODERN,
        sideNavCollapse: false,
    },
}
`}</SyntaxHighlighter>
                <p className="mb-2">
                    RoutesConfig -{' '}
                    <NavLink to="/docs/documentation/routing">Doc</NavLink>
                </p>
                <SyntaxHighlighter language="js">{`const publicRoutes = [
    {
        key: 'signIn',
        path: '/sign-in',
        component: lazy(() => import('@/views/auth/SignIn')),
        authority: [],
    },
    {
        key: 'signUp',
        path: '/sign-up',
        component: lazy(() => import('@/views/auth/SignUp')),
        authority: [],
    },
    {
        key: 'forgotPassword',
        path: '/forgot-password',
        component: lazy(() => import('@/views/auth/ForgotPassword')),
        authority: [],
    },
    {
        key: 'resetPassword',
        path: '/reset-password',
        component: lazy(() => import('@/views/auth/ResetPassword')),
        authority: [],
    },
]

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
]
`}</SyntaxHighlighter>
                <p className="mb-2">
                    NavConfig -{' '}
                    <NavLink to="/docs/documentation/routing">Doc</NavLink>
                </p>
                <SyntaxHighlighter language="js">{`const navigationConfig = [
    {
        key: 'home',
        path: '/home',
        title: 'Home',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: []
    },
]
`}</SyntaxHighlighter>
            </div>
        </>
    )
}

export default RouteAndNav
