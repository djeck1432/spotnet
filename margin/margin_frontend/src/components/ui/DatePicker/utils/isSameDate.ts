import { isSameMonth } from './isSameMonth'

export function isSameDate(date: Date, comparison: Date) {
    return (
        isSameMonth(date, comparison) && date.getDate() === comparison.getDate()
    )
}
