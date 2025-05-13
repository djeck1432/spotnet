import { isSameDate } from '../../../utils'
import isWeekend from './isWeekend'
import isOutside from './isOutside'
import isDisabled from './isDisabled'
import getRangeProps from './getRangeProps'

export type GetDayProps = {
    date: Date
    month: Date
    hasValue: boolean
    maxDate: Date
    minDate: Date
    value: Date
    disableDate: (date: Date) => boolean
    disableOutOfMonth: boolean
    range: [Date, Date]
    weekendDays: number[]
}

export type GetDayPropsReturn = {
    disabled: boolean
    weekend: boolean
    selectedInRange: boolean
    selected: boolean
    inRange: boolean
    firstInRange: boolean
    lastInRange: boolean
    outOfMonth: boolean
}

export default function getDayProps(props: GetDayProps): GetDayPropsReturn {
    const {
        date,
        month,
        hasValue,
        minDate,
        maxDate,
        value,
        disableDate,
        disableOutOfMonth,
        range,
        weekendDays,
    } = props

    const outOfMonth = isOutside(date, month)
    const selected =
        hasValue &&
        (Array.isArray(value)
            ? value.some((val) => isSameDate(val, date))
            : isSameDate(date, value))
    const { inRange, lastInRange, firstInRange, selectedInRange } =
        getRangeProps(date, range)

    return {
        disabled: isDisabled({
            minDate,
            maxDate,
            disableDate,
            disableOutOfMonth,
            date,
            outOfMonth,
        }),
        weekend: isWeekend(date, weekendDays),
        selectedInRange,
        selected,
        inRange,
        firstInRange,
        lastInRange,
        outOfMonth,
    }
}
