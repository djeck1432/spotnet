import { useState, useRef, forwardRef, useEffect } from 'react'
import dayjs from 'dayjs'
import useControllableState from '../hooks/useControllableState'
import useMergedRef from '../hooks/useMergeRef'
import Calendar from './Calendar'
import BasePicker from './BasePicker'
import { useConfig } from '../ConfigProvider'
import capitalize from '../utils/capitalize'
import type { CommonProps } from '../@types/common'
import type { CalendarSharedProps } from './CalendarBase'
import type { BasePickerSharedProps } from './BasePicker'
import type { FocusEvent, KeyboardEvent, ChangeEvent } from 'react'

const DEFAULT_INPUT_FORMAT = 'YYYY-MM-DD'

export interface DatePickerProps
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
    defaultValue?: Date | null
    value?: Date | null
    inputFormat?: string
    inputtableBlurClose?: boolean
    openPickerOnClear?: boolean
    onChange?: (value: Date | null) => void
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
    (props, ref) => {
        const {
            className,
            clearable = true,
            clearButton,
            closePickerOnChange = true,
            dateViewCount,
            dayClassName,
            dayStyle,
            defaultMonth,
            defaultOpen = false,
            defaultValue,
            defaultView,
            disabled = false,
            disableDate,
            enableHeaderLabel,
            disableOutOfMonth,
            firstDayOfWeek = 'monday',
            hideOutOfMonthDates,
            hideWeekdays,
            inputFormat,
            inputPrefix,
            inputSuffix,
            inputtable,
            labelFormat = {
                month: 'MMM',
                year: 'YYYY',
            },
            locale,
            maxDate,
            minDate,
            name = 'date',
            onBlur,
            onChange,
            onFocus,
            onDropdownClose,
            onDropdownOpen,
            openPickerOnClear = false,
            renderDay,
            size,
            style,
            type,
            value,
            weekendDays,
            yearLabelFormat,
            ...rest
        } = props

        const { locale: themeLocale } = useConfig()

        const finalLocale = locale || themeLocale

        const dateFormat =
            type === 'date'
                ? DEFAULT_INPUT_FORMAT
                : inputFormat || DEFAULT_INPUT_FORMAT

        const [dropdownOpened, setDropdownOpened] = useState(defaultOpen)

        const inputRef = useRef<HTMLInputElement>(null)

        const [lastValidValue, setLastValidValue] = useState(
            defaultValue ?? null,
        )

        const [_value, setValue] = useControllableState({
            prop: value,
            defaultProp: defaultValue,
            onChange,
        })

        const [calendarMonth, setCalendarMonth] = useState(
            _value || defaultMonth || new Date(),
        )

        const [focused, setFocused] = useState(false)

        const [inputState, setInputState] = useState(
            _value instanceof Date
                ? capitalize(
                      dayjs(_value).locale(finalLocale).format(dateFormat),
                  )
                : '',
        )

        const closeDropdown = () => {
            setDropdownOpened(false)
            onDropdownClose?.()
        }

        const openDropdown = () => {
            setDropdownOpened(true)
            onDropdownOpen?.()
        }

        useEffect(() => {
            if (!_value) {
                if (maxDate && dayjs(calendarMonth).isAfter(maxDate)) {
                    setCalendarMonth(maxDate)
                }

                if (minDate && dayjs(calendarMonth).isBefore(minDate)) {
                    setCalendarMonth(minDate)
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [minDate, maxDate])

        useEffect(() => {
            if (value === null && !focused) {
                setInputState('')
            }

            if (value instanceof Date && !focused) {
                setInputState(
                    capitalize(
                        dayjs(value).locale(finalLocale).format(dateFormat),
                    ),
                )
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [value, focused, themeLocale])

        useEffect(() => {
            if (defaultValue instanceof Date && inputState && !focused) {
                setInputState(
                    capitalize(
                        dayjs(_value).locale(finalLocale).format(dateFormat),
                    ),
                )
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [themeLocale])

        const handleValueChange = (date: Date | null) => {
            setValue(date)
            setInputState(
                capitalize(dayjs(date).locale(finalLocale).format(dateFormat)),
            )
            closePickerOnChange && closeDropdown()
            window.setTimeout(() => inputRef.current?.focus(), 0)
        }

        const handleClear = () => {
            setValue(null)
            setLastValidValue(null)
            setInputState('')
            openPickerOnClear && openDropdown()
            inputRef.current?.focus()
        }

        const parseDate = (date: string) =>
            dayjs(date, dateFormat, finalLocale).toDate()

        const setDateFromInput = () => {
            let date = typeof _value === 'string' ? parseDate(_value) : _value

            if (maxDate && dayjs(date).isAfter(maxDate)) {
                date = maxDate
            }

            if (minDate && dayjs(date).isBefore(minDate)) {
                date = minDate
            }

            if (dayjs(date).isValid()) {
                setValue(date)
                setLastValidValue(date as Date)
                setInputState(
                    capitalize(
                        dayjs(date).locale(finalLocale).format(dateFormat),
                    ),
                )
                setCalendarMonth(date as Date)
            } else {
                setValue(lastValidValue)
            }
        }

        const handleInputBlur = (
            event: FocusEvent<HTMLInputElement, Element>,
        ) => {
            typeof onBlur === 'function' && onBlur(event)
            setFocused(false)

            if (inputtable) {
                setDateFromInput()
            }
        }

        const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter' && inputtable) {
                closeDropdown()
                setDateFromInput()
            }
        }

        const handleInputFocus = (
            event: FocusEvent<HTMLInputElement, Element>,
        ) => {
            typeof onFocus === 'function' && onFocus(event)
            setFocused(true)
        }

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            openDropdown()

            const date = parseDate(event.target.value)
            if (dayjs(date).isValid()) {
                setValue(date)
                setLastValidValue(date)
                setInputState(event.target.value)
                setCalendarMonth(date)
            } else {
                setInputState(event.target.value)
            }
        }

        return (
            <BasePicker
                ref={useMergedRef(ref, inputRef)}
                inputtable={inputtable}
                dropdownOpened={dropdownOpened as boolean}
                setDropdownOpened={setDropdownOpened}
                size={size}
                style={style}
                className={className}
                name={name}
                inputLabel={inputState}
                clearable={
                    type === 'date' ? false : clearable && !!_value && !disabled
                }
                clearButton={clearButton}
                disabled={disabled}
                type={type}
                inputPrefix={inputPrefix}
                inputSuffix={inputSuffix}
                onChange={handleChange}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onKeyDown={handleKeyDown}
                onClear={handleClear}
                onDropdownClose={onDropdownClose}
                onDropdownOpen={onDropdownOpen}
                {...rest}
            >
                <Calendar
                    locale={finalLocale}
                    month={inputtable ? calendarMonth : undefined}
                    defaultMonth={
                        defaultMonth ||
                        (_value instanceof Date ? _value : new Date())
                    }
                    value={
                        _value instanceof Date
                            ? _value
                            : _value && dayjs(_value).toDate()
                    }
                    labelFormat={labelFormat}
                    dayClassName={dayClassName}
                    dayStyle={dayStyle}
                    disableOutOfMonth={disableOutOfMonth}
                    minDate={minDate}
                    maxDate={maxDate}
                    disableDate={disableDate}
                    firstDayOfWeek={firstDayOfWeek}
                    preventFocus={inputtable}
                    dateViewCount={dateViewCount}
                    enableHeaderLabel={enableHeaderLabel}
                    defaultView={defaultView}
                    hideOutOfMonthDates={hideOutOfMonthDates}
                    hideWeekdays={hideWeekdays}
                    renderDay={renderDay}
                    weekendDays={weekendDays}
                    yearLabelFormat={yearLabelFormat}
                    onMonthChange={setCalendarMonth}
                    onChange={handleValueChange}
                />
            </BasePicker>
        )
    },
)

DatePicker.displayName = 'DatePicker'

export default DatePicker
