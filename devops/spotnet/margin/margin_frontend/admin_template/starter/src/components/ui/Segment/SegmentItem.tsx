import { forwardRef, useCallback, useContext } from 'react'
import classNames from 'classnames'
import SegmentContext, { useSegment } from './context'
import { CONTROL_SIZES, SIZES } from '../utils/constants'
import type { CommonProps, TypeAttributes } from '../@types/common'
import type { SegmentValue } from './context'
import type { ReactNode, ComponentPropsWithRef } from 'react'

type ChildrenParams = {
    active: boolean
    disabled: boolean
    value: string
    onSegmentItemClick: () => void
}

export interface SegmentItemProps
    extends Omit<CommonProps, 'children'>,
        Omit<ComponentPropsWithRef<'button'>, 'children'> {
    children: ((params: ChildrenParams) => ReactNode) | ReactNode
    disabled?: boolean
    size?: TypeAttributes.Size
    value?: string
}

const unwrapArray = (arg: (params: ChildrenParams) => ReactNode) =>
    Array.isArray(arg) ? arg[0] : arg

const SegmentItem = forwardRef<HTMLButtonElement, SegmentItemProps>(
    (props, ref) => {
        const { size } = useContext(SegmentContext)

        const {
            children,
            className,
            disabled = false,
            value: valueProp,
            ...rest
        } = props

        const {
            value: valueContext,
            onActive,
            onDeactivate,
            selectionType,
        } = useSegment()

        const active = (valueContext as string[]).includes(valueProp as string)

        const getSegmentSize = useCallback(() => {
            let sizeClass = ''
            switch (size) {
                case SIZES.LG:
                    sizeClass = classNames(
                        `h-${CONTROL_SIZES.lg} md:px-8 py-2 px-4 text-base`,
                    )
                    break
                case SIZES.SM:
                    sizeClass = classNames(
                        `h-${CONTROL_SIZES.sm} px-3 py-2 text-sm`,
                    )
                    break
                case SIZES.XS:
                    sizeClass = classNames(
                        `h-${CONTROL_SIZES.xs} px-3 py-1 text-xs`,
                    )
                    break
                default:
                    sizeClass = classNames(
                        `h-${CONTROL_SIZES.md} md:px-8 py-2 px-4`,
                    )
                    break
            }
            return sizeClass
        }, [size])

        const onSegmentItemClick = () => {
            if (!disabled) {
                if (!active) {
                    if (selectionType === 'single') {
                        onActive?.([valueProp as string])
                    }
                    if (selectionType === 'multiple') {
                        const nextValue = [
                            ...(valueContext as string[]),
                            ...[valueProp],
                        ] as string[]
                        onActive?.(nextValue)
                    }
                } else if (selectionType === 'multiple') {
                    onDeactivate?.(valueProp as SegmentValue)
                }
            }
        }

        return typeof children === 'function' ? (
            unwrapArray(children)({
                active,
                onSegmentItemClick,
                disabled,
                value: valueProp,
                ...rest,
            })
        ) : (
            <button
                ref={ref}
                className={classNames(
                    'segment-item segment-item-default',
                    active && 'segment-item-active',
                    disabled && 'segment-item-disabled',
                    getSegmentSize(),
                    className,
                )}
                onClick={onSegmentItemClick}
                {...rest}
            >
                {children}
            </button>
        )
    },
)

SegmentItem.displayName = 'SegmentItem'

export default SegmentItem
