import { lazy } from 'react'
import { DocumentationRoute } from '@/@types/docs'

const documentationRoutes: DocumentationRoute[] = [
    {
        groupName: 'Getting Started',
        nav: [
            {
                path: 'introduction',
                label: 'Introduction',
                component: lazy(() => import('./components/Introduction')),
            },
            {
                path: 'installation',
                label: 'Installation',
                component: lazy(() => import('./components/Installation')),
            },
            {
                path: 'tailwindcss',
                label: 'TailwindCSS',
                component: lazy(() => import('./components/TailwindCss')),
            },
            {
                path: 'css',
                label: 'CSS',
                component: lazy(() => import('./components/Css')),
            },
            {
                path: 'starter',
                label: 'Starter',
                component: lazy(() => import('./components/Starter')),
            },
            {
                path: 'typescript',
                label: 'Typescript',
                component: lazy(() => import('./components/TypeScript')),
            },
            {
                path: 'updating',
                label: 'Updating',
                component: lazy(() => import('./components/Updating')),
            },
        ],
    },
    {
        groupName: 'Development',
        nav: [
            {
                path: 'development-server',
                label: 'Development Server',
                component: lazy(() => import('./components/DevelopmentServer')),
            },
            {
                path: 'folder-structure',
                label: 'Folder Structure',
                component: lazy(() => import('./components/FolderStructure')),
            },
            {
                path: 'routing',
                label: 'Routing',
                component: lazy(() => import('./components/Routing')),
            },
            {
                path: 'redux',
                label: 'Redux',
                component: lazy(() => import('./components/Redux')),
            },
            {
                path: 'api-integration',
                label: 'API Integration',
                component: lazy(() => import('./components/ApiIntegration')),
            },
            {
                path: 'authentication',
                label: 'Authentication',
                component: lazy(() => import('./components/Authentication')),
            },
            {
                path: 'mock-api',
                label: 'Mock Api',
                component: lazy(() => import('./components/MockApi')),
            },
            {
                path: 'firebase-integration',
                label: 'Firebase Integration',
                component: lazy(
                    () => import('./components/FirebaseIntegration'),
                ),
            },
        ],
    },
    {
        groupName: 'Configuration',
        nav: [
            {
                path: 'app',
                label: 'App Config',
                component: lazy(() => import('./components/Application')),
            },
            {
                path: 'layouts',
                label: 'Layouts',
                component: lazy(() => import('./components/Layouts')),
            },
            {
                path: 'navigation-config',
                label: 'Navigation Config',
                component: lazy(() => import('./components/NavigationConfig')),
            },
            {
                path: 'theme-color',
                label: 'Theme Color',
                component: lazy(() => import('./components/ThemeColor')),
            },
            {
                path: 'internationalization',
                label: 'Internationalization',
                component: lazy(
                    () => import('./components/Internationalization'),
                ),
            },
            {
                path: 'dark-light-mode',
                label: 'Dark/Light Mode',
                component: lazy(() => import('./components/DarkLightMode')),
            },
            {
                path: 'direction',
                label: 'Direction',
                component: lazy(() => import('./components/Direction')),
            },
            {
                path: 'overall-theme-config',
                label: 'Overall Theme Config',
                component: lazy(
                    () => import('./components/OverallThemeConfig'),
                ),
            },
        ],
    },
    {
        groupName: 'Deployment',
        nav: [
            {
                path: 'build-production',
                label: 'Build production',
                component: lazy(() => import('./components/BuildProduction')),
            },
        ],
    },
    {
        groupName: 'Other',
        nav: [
            {
                path: 'credit',
                label: 'Sources & Credits',
                component: lazy(() => import('./components/Credit')),
            },
        ],
    },
]

export default documentationRoutes
