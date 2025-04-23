import { forwardRef } from 'react'
import classNames from 'classnames'
import { useConfig } from '../../../ConfigProvider'
import type { ComponentPropsWithRef, ReactNode, MouseEvent } from 'react'
import type { CommonProps } from '../../../@types/common'

export interface DayProps
    extends CommonProps,
        Omit<ComponentPropsWithRef<'button'>, 'value' | 'onMouseEnter'> {
    value: Date
    selected: boolean
    weekend: boolean
    outOfMonth: boolean
    onMouseEnter: (date: Date, event: MouseEvent<HTMLButtonElement>) => void
    hasValue: boolean
    inRange: boolean
    firstInRange: boolean
    lastInRange: boolean
    isToday: boolean
    fullWidth: boolean
    firstInMonth: boolean
    focusable: boolean
    hideOutOfMonthDates?: boolean
    renderDay?: (date: Date) => ReactNode
    disabled: boolean
}

function getDayTabIndex({
    focusable,
    hasValue,
    selected,
    firstInMonth,
}: {
    focusable: boolean
    hasValue: boolean
    selected: boolean
    firstInMonth: boolean
}) {
    if (!focusable) {
        return -1
    }

    if (hasValue) {
        return selected ? 0 : -1
    }

    return firstInMonth ? 0 : -1
}

const Day = forwardRef<HTMLButtonElement, DayProps>((props, ref) => {
    const {
        className,
        value,
        selected,
        weekend,
        outOfMonth,
        onMouseEnter,
        hasValue,
        firstInRange,
        lastInRange,
        inRange,
        isToday,
        firstInMonth,
        focusable,
        hideOutOfMonthDates,
        renderDay,
        disabled,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        fullWidth,
        ...others
    } = props

    const { themeColor, primaryColorLevel } = useConfig()

    return (
        <button
            {...others}
            ref={ref}
            type="button"
            disabled={disabled}
            tabIndex={getDayTabIndex({
                focusable,
                hasValue,
                selected,
                firstInMonth,
            })}
            className={classNames(
                'date-picker-cell-content',
                disabled && 'date-picker-cell-disabled',
                isToday && `border border-${themeColor}-${primaryColorLevel}`,
                weekend && !disabled && 'date-picker-cell-weekend',
                outOfMonth && !disabled && 'date-picker-other-month',
                outOfMonth && hideOutOfMonthDates && 'd-none',
                !outOfMonth &&
                    !disabled &&
                    !selected &&
                    'date-picker-cell-current-month',
                !disabled &&
                    !selected &&
                    !inRange &&
                    'date-picker-cell-hoverable',
                selected &&
                    !disabled &&
                    `bg-${themeColor}-${primaryColorLevel} text-gray-100`,
                inRange &&
                    !disabled &&
                    !firstInRange &&
                    !lastInRange &&
                    !selected &&
                    `bg-${themeColor}-${primaryColorLevel} bg-opacity-10`,
                !inRange && !firstInRange && !lastInRange && 'rounded-lg',
                firstInRange &&
                    !disabled &&
                    'ltr:rounded-tl-lg ltr:rounded-bl-lg rtl:rounded-tr-lg rtl:rounded-br-lg',
                lastInRange &&
                    !disabled &&
                    'ltr:rounded-tr-lg ltr:rounded-br-lg rtl:rounded-tl-lg rtl:rounded-bl-lg',
                className,
            )}
            onMouseEnter={(event) => onMouseEnter(value, event)}
        >
            {typeof renderDay === 'function'
                ? renderDay(value)
                : value?.getDate()}
        </button>
    )
})

Day.displayName = 'Day'

export default Day
