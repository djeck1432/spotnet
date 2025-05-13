/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, forwardRef } from 'react'
import dayjs from 'dayjs'
import useControllableState from '../hooks/useControllableState'
import useMergedRef from '../hooks/useMergeRef'
import capitalize from '../utils/capitalize'
import RangeCalendar from './RangeCalendar'
import BasePicker from './BasePicker'
import { useConfig } from '../ConfigProvider'
import type { CommonProps } from '../@types/common'
import type { CalendarSharedProps } from './CalendarBase'
import type { BasePickerSharedProps } from './BasePicker'

export type DatePickerRangeValue = [Date | null, Date | null]

export interface DatePickerRangeProps
    extends CommonProps,
        Omit<
            CalendarSharedProps,
            | 'onMonthChange'
            | 'onChange'
            | 'isDateInRange'
            | 'isDateFirstInRange'
            | 'isDateLastInRange'
            | 'month'
        >,
        BasePickerSharedProps {
    closePickerOnChange?: boolean
    defaultOpen?: boolean
    defaultValue?: DatePickerRangeValue
    inputFormat?: string
    separator?: string
    onChange?: (value: DatePickerRangeValue) => void
    openPickerOnClear?: boolean
    singleDate?: boolean
    value?: DatePickerRangeValue
}

const validationRule = (val: any) =>
    Array.isArray(val) &&
    val.length === 2 &&
    val.every((v) => v instanceof Date)

const isFirstDateSet = (val: any) =>
    Array.isArray(val) && val.length === 2 && val[0] instanceof Date

const DatePickerRange = forwardRef<HTMLInputElement, DatePickerRangeProps>(
    (props, ref) => {
        const {
            className,
            clearable = true,
            clearButton,
            closePickerOnChange = true,
            dateViewCount = 1,
            dayClassName,
            dayStyle,
            defaultMonth,
            defaultOpen = false,
            defaultValue,
            defaultView,
            disabled,
            disableDate,
            enableHeaderLabel,
            disableOutOfMonth,
            firstDayOfWeek = 'monday',
            hideOutOfMonthDates,
            hideWeekdays,
            inputFormat,
            inputPrefix,
            inputSuffix,
            labelFormat = {
                month: 'MMM',
                year: 'YYYY',
            },
            separator = '~',
            locale,
            maxDate,
            minDate,
            onChange,
            onDropdownClose,
            onDropdownOpen,
            openPickerOnClear = false,
            renderDay,
            singleDate = false,
            size,
            style,
            value,
            weekendDays,
            yearLabelFormat,
            ...rest
        } = props

        const { locale: themeLocale } = useConfig()

        const finalLocale = locale || themeLocale

        const dateFormat = inputFormat || 'YYYY-MM-DD'

        const [dropdownOpened, setDropdownOpened] = useState(defaultOpen)

        const inputRef = useRef<HTMLInputElement>(null)

        const [_value, setValue] = useControllableState<
            [Date | null, Date | null]
        >({
            prop: value,
            defaultProp:
                defaultValue !== undefined ? defaultValue : [null, null],
            onChange,
        })

        const handleValueChange = (range: [Date, Date]) => {
            setValue(range)
            if (closePickerOnChange && validationRule(range)) {
                setDropdownOpened(false)
                onDropdownClose?.()
                window.setTimeout(() => inputRef.current?.focus(), 0)
            }
        }

        const valueValid = validationRule(_value)
        const firstValueValid = isFirstDateSet(_value)

        const firstDateLabel = _value?.[0]
            ? capitalize(
                  dayjs(_value[0]).locale(finalLocale).format(dateFormat),
              )
            : ''

        const secondDateLabel = _value?.[1]
            ? capitalize(
                  dayjs(_value[1]).locale(finalLocale).format(dateFormat),
              )
            : ''

        const handleClear = () => {
            setValue([null, null])
            setDropdownOpened(true)
            openPickerOnClear && onDropdownOpen?.()
            inputRef.current?.focus()
        }

        const handleDropdownToggle = (isOpened: boolean) => {
            if (!isOpened && firstValueValid && _value?.[1] === null) {
                handleClear()
            }
            setDropdownOpened(isOpened)
        }

        return (
            <BasePicker
                ref={useMergedRef(ref, inputRef)}
                dropdownOpened={dropdownOpened as boolean}
                setDropdownOpened={handleDropdownToggle}
                size={size}
                style={style}
                className={className}
                inputLabel={
                    firstValueValid
                        ? `${firstDateLabel} ${separator} ${secondDateLabel}`
                        : ''
                }
                clearable={clearable && firstValueValid}
                clearButton={clearButton}
                disabled={disabled}
                inputPrefix={inputPrefix}
                inputSuffix={inputSuffix}
                onClear={handleClear}
                onDropdownClose={onDropdownClose}
                onDropdownOpen={onDropdownOpen}
                {...rest}
            >
                <RangeCalendar
                    locale={finalLocale}
                    defaultMonth={
                        (valueValid ? _value?.[0] : defaultMonth) as Date
                    }
                    value={_value as [Date | null, Date | null]}
                    labelFormat={labelFormat}
                    dayClassName={dayClassName}
                    dayStyle={dayStyle}
                    disableOutOfMonth={disableOutOfMonth}
                    minDate={minDate}
                    maxDate={maxDate}
                    disableDate={disableDate}
                    firstDayOfWeek={firstDayOfWeek}
                    enableHeaderLabel={enableHeaderLabel}
                    singleDate={singleDate}
                    dateViewCount={dateViewCount}
                    defaultView={defaultView}
                    hideOutOfMonthDates={hideOutOfMonthDates}
                    hideWeekdays={hideWeekdays}
                    renderDay={renderDay}
                    weekendDays={weekendDays}
                    yearLabelFormat={yearLabelFormat}
                    onChange={(date) => handleValueChange(date as [Date, Date])}
                />
            </BasePicker>
        )
    },
)

DatePickerRange.displayName = 'DatePickerRange'

export default DatePickerRange
