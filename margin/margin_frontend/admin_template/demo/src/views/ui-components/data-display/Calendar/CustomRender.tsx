import { useState } from 'react'
import Calendar from '@/components/ui/Calendar'
import Badge from '@/components/ui/Badge'

const CustomRender = () => {
    const [value, setValue] = useState<Date | null>(null)

    return (
        <div className="md:w-[260px] max-w-[260px] mx-auto">
            <Calendar
                value={value}
                dayClassName={(date, { selected }) => {
                    if (date.getDate() === 12 && !selected) {
                        return 'text-red-600'
                    }

                    if (selected) {
                        return 'text-white'
                    }

                    return 'text-gray-700 dark:text-gray-200'
                }}
                dayStyle={(date, { selected, outOfMonth }) => {
                    if (date.getDate() === 18 && !selected) {
                        return { color: '#15c39a' }
                    }

                    if (outOfMonth) {
                        return {
                            opacity: 0,
                            pointerEvents: 'none',
                            cursor: 'default',
                        }
                    }

                    return {}
                }}
                renderDay={(date) => {
                    const day = date.getDate()

                    if (day !== 12) {
                        return <span>{day}</span>
                    }

                    return (
                        <span className="relative flex justify-center items-center w-full h-full">
                            {day}
                            <Badge
                                className="absolute bottom-1"
                                innerClass="h-1 w-1"
                            />
                        </span>
                    )
                }}
                onChange={setValue}
            />
        </div>
    )
}

export default CustomRender
