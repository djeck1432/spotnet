import { lazy } from 'react'
import { UI_COMPONENTS_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const uiComponentsRoute: Routes = [
    {
        key: 'uiComponent.common.button',
        path: `${UI_COMPONENTS_PREFIX_PATH}/button`,
        component: lazy(() => import('@/views/ui-components/common/Button')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.common.grid',
        path: `${UI_COMPONENTS_PREFIX_PATH}/grid`,
        component: lazy(() => import('@/views/ui-components/common/Grid')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.common.typography',
        path: `${UI_COMPONENTS_PREFIX_PATH}/typography`,
        component: lazy(
            () => import('@/views/ui-components/common/Typography'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.common.icons',
        path: `${UI_COMPONENTS_PREFIX_PATH}/icons`,
        component: lazy(() => import('@/views/ui-components/common/Icons')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.feedback.alert',
        path: `${UI_COMPONENTS_PREFIX_PATH}/alert`,
        component: lazy(() => import('@/views/ui-components/feedback/Alert')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.feedback.dialog',
        path: `${UI_COMPONENTS_PREFIX_PATH}/dialog`,
        component: lazy(() => import('@/views/ui-components/feedback/Dialog')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.feedback.drawer',
        path: `${UI_COMPONENTS_PREFIX_PATH}/drawer`,
        component: lazy(() => import('@/views/ui-components/feedback/Drawer')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.feedback.progress',
        path: `${UI_COMPONENTS_PREFIX_PATH}/progress`,
        component: lazy(
            () => import('@/views/ui-components/feedback/Progress'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.feedback.skeleton',
        path: `${UI_COMPONENTS_PREFIX_PATH}/skeleton`,
        component: lazy(
            () => import('@/views/ui-components/feedback/Skeleton'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.feedback.spinner',
        path: `${UI_COMPONENTS_PREFIX_PATH}/spinner`,
        component: lazy(() => import('@/views/ui-components/feedback/Spinner')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.feedback.toast',
        path: `${UI_COMPONENTS_PREFIX_PATH}/toast`,
        component: lazy(() => import('@/views/ui-components/feedback/Toast')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.dataDisplay.avatar',
        path: `${UI_COMPONENTS_PREFIX_PATH}/avatar`,
        component: lazy(
            () => import('@/views/ui-components/data-display/Avatar'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.dataDisplay.badge',
        path: `${UI_COMPONENTS_PREFIX_PATH}/badge`,
        component: lazy(
            () => import('@/views/ui-components/data-display/Badge'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.dataDisplay.calendar',
        path: `${UI_COMPONENTS_PREFIX_PATH}/calendar`,
        component: lazy(
            () => import('@/views/ui-components/data-display/Calendar'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.dataDisplay.cards',
        path: `${UI_COMPONENTS_PREFIX_PATH}/cards`,
        component: lazy(
            () => import('@/views/ui-components/data-display/Cards'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.dataDisplay.table',
        path: `${UI_COMPONENTS_PREFIX_PATH}/table`,
        component: lazy(
            () => import('@/views/ui-components/data-display/Table'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.dataDisplay.tag',
        path: `${UI_COMPONENTS_PREFIX_PATH}/tag`,
        component: lazy(() => import('@/views/ui-components/data-display/Tag')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.dataDisplay.timeline',
        path: `${UI_COMPONENTS_PREFIX_PATH}/timeline`,
        component: lazy(
            () => import('@/views/ui-components/data-display/Timeline'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.dataDisplay.tooltip',
        path: `${UI_COMPONENTS_PREFIX_PATH}/tooltip`,
        component: lazy(
            () => import('@/views/ui-components/data-display/Tooltip'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.checkbox',
        path: `${UI_COMPONENTS_PREFIX_PATH}/checkbox`,
        component: lazy(() => import('@/views/ui-components/forms/Checkbox')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.datePicker',
        path: `${UI_COMPONENTS_PREFIX_PATH}/date-picker`,
        component: lazy(() => import('@/views/ui-components/forms/DatePicker')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.formControl',
        path: `${UI_COMPONENTS_PREFIX_PATH}/form-control`,
        component: lazy(
            () => import('@/views/ui-components/forms/FormControl'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.input',
        path: `${UI_COMPONENTS_PREFIX_PATH}/input`,
        component: lazy(() => import('@/views/ui-components/forms/Input')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.inputGroup',
        path: `${UI_COMPONENTS_PREFIX_PATH}/input-group`,
        component: lazy(() => import('@/views/ui-components/forms/InputGroup')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.radio',
        path: `${UI_COMPONENTS_PREFIX_PATH}/radio`,
        component: lazy(() => import('@/views/ui-components/forms/Radio')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.segment',
        path: `${UI_COMPONENTS_PREFIX_PATH}/segment`,
        component: lazy(() => import('@/views/ui-components/forms/Segment')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.select',
        path: `${UI_COMPONENTS_PREFIX_PATH}/select`,
        component: lazy(() => import('@/views/ui-components/forms/Select')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.switcher',
        path: `${UI_COMPONENTS_PREFIX_PATH}/switcher`,
        component: lazy(() => import('@/views/ui-components/forms/Switcher')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.timeInput',
        path: `${UI_COMPONENTS_PREFIX_PATH}/time-input`,
        component: lazy(() => import('@/views/ui-components/forms/TimeInput')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.forms.upload',
        path: `${UI_COMPONENTS_PREFIX_PATH}/upload`,
        component: lazy(() => import('@/views/ui-components/forms/Upload')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.navigation.dropdown',
        path: `${UI_COMPONENTS_PREFIX_PATH}/dropdown`,
        component: lazy(
            () => import('@/views/ui-components/navigation/Dropdown'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.navigation.menu',
        path: `${UI_COMPONENTS_PREFIX_PATH}/menu`,
        component: lazy(() => import('@/views/ui-components/navigation/Menu')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.navigation.pagination',
        path: `${UI_COMPONENTS_PREFIX_PATH}/pagination`,
        component: lazy(
            () => import('@/views/ui-components/navigation/Pagination'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.navigation.steps',
        path: `${UI_COMPONENTS_PREFIX_PATH}/steps`,
        component: lazy(() => import('@/views/ui-components/navigation/Steps')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.navigation.tabs',
        path: `${UI_COMPONENTS_PREFIX_PATH}/tabs`,
        component: lazy(() => import('@/views/ui-components/navigation/Tabs')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.graph.charts',
        path: `${UI_COMPONENTS_PREFIX_PATH}/graph/charts`,
        component: lazy(() => import('@/views/ui-components/graph/Charts')),
        authority: [ADMIN, USER],
    },
    {
        key: 'uiComponent.graph.maps',
        path: `${UI_COMPONENTS_PREFIX_PATH}/graph/maps`,
        component: lazy(() => import('@/views/ui-components/graph/Maps')),
        authority: [ADMIN, USER],
    },
]

export default uiComponentsRoute
