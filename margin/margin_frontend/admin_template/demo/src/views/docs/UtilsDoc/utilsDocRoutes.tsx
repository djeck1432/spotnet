import { lazy } from 'react'
import { DocumentationRoute } from '@/@types/docs'

const utilsDocRoutes: DocumentationRoute[] = [
    {
        groupName: 'Hooks',
        nav: [
            {
                path: 'use-auth',
                label: 'useAuth',
                component: lazy(() => import('./components/UseAuthDoc')),
            },
            {
                path: 'use-authority',
                label: 'useAuthority',
                component: lazy(() => import('./components/UseAuthorityDoc')),
            },
            {
                path: 'use-dark-mode',
                label: 'useDarkMode',
                component: lazy(() => import('./components/UseDarkModeDoc')),
            },
            {
                path: 'use-direction',
                label: 'useDirection',
                component: lazy(() => import('./components/UseDirectionDoc')),
            },
            {
                path: 'use-locale',
                label: 'useLocale',
                component: lazy(() => import('./components/UseLocaleDoc')),
            },
            {
                path: 'use-menu-active',
                label: 'useMenuActive',
                component: lazy(() => import('./components/UseMenuActiveDoc')),
            },
            {
                path: 'use-query',
                label: 'useQuery',
                component: lazy(() => import('./components/UseQueryDoc')),
            },
            {
                path: 'use-responsive',
                label: 'useResponsive',
                component: lazy(() => import('./components/UseResponsiveDoc')),
            },
            {
                path: 'use-theme-class',
                label: 'useThemeClass',
                component: lazy(() => import('./components/UseThemeClassDoc')),
            },
            {
                path: 'use-time-out-message',
                label: 'useTimeOutMessage',
                component: lazy(
                    () => import('./components/UseTimeOutMessageDoc'),
                ),
            },
            {
                path: 'use-tw-color-by-name',
                label: 'useTwColorByName',
                component: lazy(
                    () => import('./components/UseTwColorByNameDoc'),
                ),
            },
        ],
    },
    {
        groupName: 'Functions',
        nav: [
            {
                path: 'acronym',
                label: 'acronym',
                component: lazy(() => import('./components/AcronymDoc')),
            },
            {
                path: 'deep-parse-json',
                label: 'deepParseJson',
                component: lazy(() => import('./components/DeepParseJsonDoc')),
            },
            {
                path: 'grow-shrink-color',
                label: 'growShrinkColor',
                component: lazy(
                    () => import('./components/GrowShrinkColorDoc'),
                ),
            },
            {
                path: 'is-last-child',
                label: 'isLastChild',
                component: lazy(() => import('./components/IsLastChildDoc')),
            },
            {
                path: 'paginate',
                label: 'paginate',
                component: lazy(() => import('./components/PaginateDoc')),
            },
            {
                path: 'required-field-validation',
                label: 'requiredFieldValidation',
                component: lazy(
                    () => import('./components/RequiredFieldValidationDoc'),
                ),
            },
            {
                path: 'shade-color',
                label: 'shadeColor',
                component: lazy(() => import('./components/ShadeColorDoc')),
            },
            {
                path: 'sort-by',
                label: 'sortBy',
                component: lazy(() => import('./components/SortByDoc')),
            },
            {
                path: 'wild-card-search',
                label: 'wildCardSearch',
                component: lazy(() => import('./components/WildCardSearchDoc')),
            },
        ],
    },
    {
        groupName: 'HOC',
        nav: [
            {
                path: 'with-header-item',
                label: 'withHeaderItem',
                component: lazy(() => import('./components/WithHeaderItemDoc')),
            },
        ],
    },
]

export default utilsDocRoutes
