import { useState } from 'react'
import Calendar from '@/components/ui/Calendar'
import dayjs from 'dayjs'

const Basic = () => {
    const [value, setValue] = useState<Date | null>(null)

    const dateGap = 7

    // Only able to select previos & future 7 days start from today
    const minDate = dayjs(new Date())
        .subtract(dateGap, 'day')
        .startOf('day')
        .toDate()
    const maxDate = dayjs(new Date()).add(dateGap, 'day').toDate()

    return (
        <div className="md:w-[260px] max-w-[260px] mx-auto">
            <Calendar
                value={value}
                minDate={minDate}
                maxDate={maxDate}
                onChange={setValue}
            />
        </div>
    )
}

export default Basic
