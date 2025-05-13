import { useState } from 'react'
import RangeCalendar from '@/components/ui/RangeCalendar'
import dayjs from 'dayjs'

const Range = () => {
    const [value, setValue] = useState<[Date | null, Date | null]>([
        new Date(),
        dayjs(new Date()).add(5, 'days').toDate(),
    ])

    return (
        <div className="md:w-[260px] max-w-[260px] mx-auto">
            <RangeCalendar value={value} onChange={setValue} />
        </div>
    )
}

export default Range
