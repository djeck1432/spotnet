import { useState } from 'react'
import Calendar from '@/components/ui/Calendar'

const DisabledCertainDate = () => {
    const [value, setValue] = useState<Date | null>(null)

    const disableCertainDate = (date: Date) => {
        const banDate = [7, 15, 21]
        return banDate.includes(date.getDate())
    }

    return (
        <div className="md:w-[260px] max-w-[260px] mx-auto">
            <Calendar
                value={value}
                disableDate={disableCertainDate}
                onChange={setValue}
            />
        </div>
    )
}

export default DisabledCertainDate
