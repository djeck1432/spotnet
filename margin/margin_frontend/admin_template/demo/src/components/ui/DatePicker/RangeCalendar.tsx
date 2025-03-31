import { useState, forwardRef } from 'react'
import dayjs from 'dayjs'
import { isSameDate } from './utils/isSameDate'
import CalendarBase from './CalendarBase'
import type { CommonProps } from '../@types/common'
import type { CalendarSharedProps } from './CalendarBase'
import type { Modifiers } from './tables/components/types'

export interface RangeCalendarProps
    extends CommonProps,
        Omit<
            CalendarSharedProps,
            | 'value'
            | 'isDateInRange'
            | 'isDateFirstInRange'
            | 'isDateLastInRange'
        > {
    value: [Date | null, Date | null]
    onChange: (value: [Date | null, Date | null]) => void
    singleDate?: boolean
}

const RangeCalendar = forwardRef<HTMLDivElement, RangeCalendarProps>(
    (props, ref) => {
        const {
            value,
            onChange,
            dayStyle,
            singleDate = false,
            dateViewCount = 1,
            paginateBy,
            ...rest
        } = props

        const [hoveredDay, setHoveredDay] = useState<Date | null>(null)
        const [pickedDate, setPickedDate] = useState<Date | null>(null)

        const setRangeDate = (date: Date) => {
            if (pickedDate instanceof Date) {
                if (isSameDate(date, pickedDate) && !singleDate) {
                    setPickedDate(null)
                    setHoveredDay(null)
                    return null
                }

                const result: [Date, Date] = [date, pickedDate]
                result.sort((a, b) => a.getTime() - b.getTime())
                onChange(result)
                setPickedDate(null)
                return null
            }

            if (value[0] && isSameDate(date, value[0]) && !singleDate) {
                setPickedDate(null)
                setHoveredDay(null)
                onChange([null, null])
                return null
            }

            onChange([date, null])
            setPickedDate(date)
            return null
        }

        const shouldHighlightDate = (date: Date, modifiers: Modifiers) => {
            if (pickedDate instanceof Date && hoveredDay instanceof Date) {
                const result = [hoveredDay, pickedDate]
                result.sort((a, b) => a.getTime() - b.getTime())
                return (
                    !modifiers.selected &&
                    dayjs(date).subtract(1, 'day').isBefore(result[1]) &&
                    dayjs(date).add(1, 'day').isAfter(result[0])
                )
            }

            return false
        }

        const isPickedDateFirstInRange = (date: Date, modifiers: Modifiers) => {
            if (pickedDate instanceof Date && hoveredDay instanceof Date) {
                const result = [hoveredDay, pickedDate]
                result.sort((a, b) => a.getTime() - b.getTime())
                return modifiers.selected && dayjs(date).isBefore(result[1])
            }

            return false
        }

        const isPickedDateLastInRange = (date: Date, modifiers: Modifiers) => {
            if (pickedDate instanceof Date && hoveredDay instanceof Date) {
                const result = [hoveredDay, pickedDate]
                result.sort((a, b) => a.getTime() - b.getTime())
                return modifiers.selected && dayjs(date).isAfter(result[0])
            }

            return false
        }

        return (
            <CalendarBase
                ref={ref}
                dayStyle={dayStyle}
                value={pickedDate}
                range={value as [Date, Date]}
                dateViewCount={dateViewCount}
                paginateBy={paginateBy || dateViewCount}
                hideOutOfMonthDates={(dateViewCount as number) > 1}
                isDateInRange={shouldHighlightDate}
                isDateFirstInRange={isPickedDateFirstInRange}
                isDateLastInRange={isPickedDateLastInRange}
                onDayMouseEnter={(date) => setHoveredDay(date)}
                onChange={(date) => setRangeDate(date as Date)}
                {...rest}
            />
        )
    },
)

RangeCalendar.displayName = 'RangeCalendar'

export default RangeCalendar
