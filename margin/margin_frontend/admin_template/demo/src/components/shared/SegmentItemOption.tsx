import { forwardRef } from 'react'
import classNames from 'classnames'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { HiCheckCircle } from 'react-icons/hi'
import type { CommonProps } from '@/@types/common'

interface SegmentItemOptionProps extends CommonProps {
    active: boolean
    customCheck?: string | React.ReactNode
    defaultGutter?: boolean
    disabled?: boolean
    hoverable?: boolean
    onSegmentItemClick?: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => void
}

const SegmentItemOption = forwardRef<HTMLDivElement, SegmentItemOptionProps>(
    (props, ref) => {
        const {
            active,
            children,
            className,
            customCheck,
            defaultGutter = true,
            disabled,
            hoverable,
            onSegmentItemClick,
        } = props

        const { textTheme, borderTheme, ringTheme } = useThemeClass()

        return (
            <div
                ref={ref}
                className={classNames(
                    'flex',
                    !customCheck && 'justify-between',
                    'items-center',
                    'border',
                    'rounded-md ',
                    'border-gray-200 dark:border-gray-600',
                    defaultGutter && 'py-5 px-4',
                    'cursor-pointer',
                    'select-none',
                    'w-100',
                    active && `ring-1 ${ringTheme} ${borderTheme}`,
                    hoverable &&
                        `hover:ring-1 hover:${ringTheme} hover:${borderTheme}`,
                    disabled && 'opacity-50 cursor-not-allowed',
                    className,
                )}
                onClick={onSegmentItemClick}
            >
                {children}
                {active && !customCheck && (
                    <HiCheckCircle
                        className={classNames(textTheme, 'text-2xl')}
                    />
                )}
                {active && customCheck}
            </div>
        )
    },
)

SegmentItemOption.displayName = 'SegmentItemOption'

export default SegmentItemOption
