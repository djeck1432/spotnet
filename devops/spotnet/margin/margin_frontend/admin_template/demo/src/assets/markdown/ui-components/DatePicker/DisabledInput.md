```jsx
import { useState } from 'react'
import DatePicker from '@/components/ui/DatePicker'

const DisabledInput = () => {
    const [date] = useState(new Date())

    return (
        <div>
            <DatePicker disabled className="mb-4" placeholder="Select a date" />
            <DatePicker disabled className="mb-4" value={date} />
        </div>
    )
}

export default DisabledInput
```
