import { lazy } from 'react'
import { DOCS_PREFIX_PATH } from '@/constants/route.constant'
import type { Routes } from '@/@types/routes'

const docsRoute: Routes = [
    {
        key: 'docs.documentation',
        path: `${DOCS_PREFIX_PATH}/documentation/*`,
        component: lazy(() => import('@/views/docs/Documentations')),
        authority: [],
    },
    {
        key: 'docs.sharedComponentDoc',
        path: `${DOCS_PREFIX_PATH}/shared-component-doc/*`,
        component: lazy(() => import('@/views/docs/SharedComponentsDoc')),
        authority: [],
    },
    {
        key: 'docs.utilsDoc',
        path: `${DOCS_PREFIX_PATH}/utils-doc/*`,
        component: lazy(() => import('@/views/docs/UtilsDoc')),
        authority: [],
    },
    {
        key: 'docs.changeLog',
        path: `${DOCS_PREFIX_PATH}/changelog`,
        component: lazy(() => import('@/views/docs/ChangeLog')),
        authority: [],
    },
]

export default docsRoute
