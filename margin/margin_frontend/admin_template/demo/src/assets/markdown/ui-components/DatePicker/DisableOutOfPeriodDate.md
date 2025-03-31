```jsx
import DatePicker from '@/components/ui/DatePicker'
import dayjs from 'dayjs'

const DisableOutOfRangeDate = () => {
    const dateGap = 7

    // Only able to select previos & future 7 days start from today
    const minDate = dayjs(new Date())
        .subtract(dateGap, 'day')
        .startOf('day')
        .toDate()
    const maxDate = dayjs(new Date()).add(dateGap, 'day').toDate()

    return (
        <DatePicker
            placeholder="Pick a date"
            minDate={minDate}
            maxDate={maxDate}
        />
    )
}

export default DisableOutOfRangeDate
```
