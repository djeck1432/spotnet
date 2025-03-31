import type { LazyExoticComponent, JSX } from 'react'

export type DocRouteNav = {
    path: string
    label: string
    component: LazyExoticComponent<() => JSX.Element>
}

export type DocumentationRoute = {
    groupName: string
    nav: DocRouteNav[]
}
