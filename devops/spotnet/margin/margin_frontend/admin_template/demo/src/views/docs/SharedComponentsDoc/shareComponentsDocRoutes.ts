import { lazy } from 'react'
import { DocumentationRoute } from '@/@types/docs'

const documentationRoutes: DocumentationRoute[] = [
    {
        groupName: 'Components',
        nav: [
            {
                path: 'action-link',
                label: 'ActionLink',
                component: lazy(() => import('./components/ActionLinkDoc')),
            },
            {
                path: 'adaptable-card',
                label: 'AdaptableCard',
                component: lazy(() => import('./components/AdaptableCardDoc')),
            },
            {
                path: 'affix',
                label: 'Affix',
                component: lazy(() => import('./components/AffixDoc')),
            },
            {
                path: 'authority-check',
                label: 'AuthorityCheck',
                component: lazy(() => import('./components/AuthorityCheckDoc')),
            },
            {
                path: 'calendar-view',
                label: 'CalendarView',
                component: lazy(() => import('./components/CalendarViewDoc')),
            },
            {
                path: 'chart',
                label: 'Chart',
                component: lazy(() => import('./components/ChartDoc')),
            },
            {
                path: 'confirm-dialog',
                label: 'ConfirmDialog',
                component: lazy(() => import('./components/ConfirmDialogDoc')),
            },
            {
                path: 'container',
                label: 'Container',
                component: lazy(() => import('./components/ContainerDoc')),
            },
            {
                path: 'data-table',
                label: 'DataTable',
                component: lazy(() => import('./components/DataTableDoc')),
            },
            {
                path: 'double-sided-image',
                label: 'DoubleSidedImage',
                component: lazy(
                    () => import('./components/DoubleSidedImageDoc'),
                ),
            },
            {
                path: 'ellipsis-button',
                label: 'EllipsisButton',
                component: lazy(() => import('./components/EllipsisButtonDoc')),
            },
            {
                path: 'form-custom-format-input',
                label: 'FormCustomFormatInput',
                component: lazy(
                    () => import('./components/FormCustomFormatInputDoc'),
                ),
            },
            {
                path: 'form-numeric-input',
                label: 'FormNumericInput',
                component: lazy(
                    () => import('./components/FormNumericInputDoc'),
                ),
            },
            {
                path: 'form-pattern-input',
                label: 'FormPatternInput',
                component: lazy(
                    () => import('./components/FormPatternInputDoc'),
                ),
            },
            {
                path: 'grow-shrink-tag',
                label: 'GrowShrinkTag',
                component: lazy(() => import('./components/GrowShrinkTagDoc')),
            },
            {
                path: 'icon-text',
                label: 'IconText',
                component: lazy(() => import('./components/IconTextDoc')),
            },
            {
                path: 'loading',
                label: 'Loading',
                component: lazy(() => import('./components/LoadingDoc')),
            },
            {
                path: 'media-skeleton',
                label: 'MediaSkeleton',
                component: lazy(() => import('./components/MediaSkeletonDoc')),
            },
            {
                path: 'nav-toggle',
                label: 'NavToggle',
                component: lazy(() => import('./components/NavToggleDoc')),
            },
            {
                path: 'password-input',
                label: 'PasswordInput',
                component: lazy(() => import('./components/PasswordInputDoc')),
            },
            {
                path: 'region-map',
                label: 'RegionMap',
                component: lazy(() => import('./components/RegionMapDoc')),
            },
            {
                path: 'rich-text-editor',
                label: 'RichTextEditor',
                component: lazy(() => import('./components/RichTextEditorDoc')),
            },
            {
                path: 'segment-item-option',
                label: 'SegmentItemOption',
                component: lazy(
                    () => import('./components/SegmentItemOptionDoc'),
                ),
            },
            {
                path: 'sticky-footer',
                label: 'StickyFooter',
                component: lazy(() => import('./components/StickyFooterDoc')),
            },
            {
                path: 'svg-icon',
                label: 'SvgIcon',
                component: lazy(() => import('./components/SvgIconDoc')),
            },
            {
                path: 'syntax-highlighter',
                label: 'SyntaxHighlighter',
                component: lazy(
                    () => import('./components/SyntaxHighlighterDoc'),
                ),
            },
            {
                path: 'table-row-skeleton',
                label: 'TableRowSkeleton',
                component: lazy(
                    () => import('./components/TableRowSkeletonDoc'),
                ),
            },
            {
                path: 'text-block-skeleton',
                label: 'TextBlockSkeletonDoc',
                component: lazy(
                    () => import('./components/TextBlockSkeletonDoc'),
                ),
            },
            {
                path: 'text-ellipsis',
                label: 'TextEllipsisDoc',
                component: lazy(() => import('./components/TextEllipsisDoc')),
            },
            {
                path: 'users-avatar-group',
                label: 'UsersAvatarGroupDoc',
                component: lazy(
                    () => import('./components/UsersAvatarGroupDoc'),
                ),
            },
        ],
    },
]

export default documentationRoutes
