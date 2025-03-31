```jsx
import { useState } from 'react'
import DatePicker from '@/components/ui/DatePicker'

const DisabledCertainDate = () => {
    const [dateValue, setDateValue] = useState<Date>(new Date())

    const onCertainPeriodChange = (date: Date) => {
        setDateValue(date)
    }

    const disableCertainDate = (date: Date) => {
        const banDate = [7, 15, 21]
        return banDate.includes(date.getDate())
    }

    return (
        <DatePicker
            value={dateValue}
            placeholder="Pick your date"
            disableDate={disableCertainDate}
            onChange={(date) => onCertainPeriodChange(date as Date)}
        />
    )
}

export default DisabledCertainDate
```
