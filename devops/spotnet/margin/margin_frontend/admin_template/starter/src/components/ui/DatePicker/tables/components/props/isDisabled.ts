import dayjs from 'dayjs'

type IsDisabledParams = {
    date: Date
    minDate?: Date
    maxDate?: Date
    disableDate?(date: Date): boolean
    disableOutOfMonth?: boolean
    outOfMonth?: boolean
}

export default function isDisabled({
    minDate,
    maxDate,
    disableDate,
    disableOutOfMonth,
    date,
    outOfMonth,
}: IsDisabledParams) {
    const isAfterMax =
        maxDate instanceof Date && dayjs(maxDate).isBefore(date, 'day')
    const isBeforeMin =
        minDate instanceof Date && dayjs(minDate).isAfter(date, 'day')
    const shouldExclude = typeof disableDate === 'function' && disableDate(date)
    const disabledOutside = !!disableOutOfMonth && !!outOfMonth
    return isAfterMax || isBeforeMin || shouldExclude || disabledOutside
}
