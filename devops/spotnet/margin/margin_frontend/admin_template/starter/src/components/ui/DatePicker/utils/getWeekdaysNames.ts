import dayjs from 'dayjs'
import { getStartOfWeek } from './getStartOfWeek'
import type { FirstDayOfWeek } from '../../@types/date'

export function getWeekdaysNames(
    locale: string,
    firstDayOfWeek: FirstDayOfWeek = 'monday',
    format = 'dd',
) {
    const names = []
    const date = getStartOfWeek(new Date(), firstDayOfWeek)

    for (let i = 0; i < 7; i += 1) {
        names.push(dayjs(date).locale(locale).format(format))
        date.setDate(date.getDate() + 1)
    }

    return names
}
