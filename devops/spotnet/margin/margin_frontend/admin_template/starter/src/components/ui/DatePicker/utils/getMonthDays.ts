import { getStartOfWeek } from './getStartOfWeek'
import { getEndOfWeek } from './getEndOfWeek'
import type { FirstDayOfWeek } from '../../@types/date'

export function getMonthDays(
    month: Date,
    firstDayOfWeek: FirstDayOfWeek = 'monday',
): Date[][] {
    const currentMonth = month.getMonth()
    const startOfMonth = new Date(month.getFullYear(), currentMonth, 1)
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0)
    const endDate = getEndOfWeek(endOfMonth, firstDayOfWeek)
    const date = getStartOfWeek(startOfMonth, firstDayOfWeek)
    const weeks = []

    while (date <= endDate) {
        const days = []

        for (let i = 0; i < 7; i += 1) {
            days.push(new Date(date))
            date.setDate(date.getDate() + 1)
        }

        weeks.push(days)
    }

    return weeks
}
