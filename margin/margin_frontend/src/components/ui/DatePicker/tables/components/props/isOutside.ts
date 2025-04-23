import { isSameMonth } from '../../../utils'

export default function isOutside(date: Date, month: Date) {
    return !isSameMonth(date, month)
}
