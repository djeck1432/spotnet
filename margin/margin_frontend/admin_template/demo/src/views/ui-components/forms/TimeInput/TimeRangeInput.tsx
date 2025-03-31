import TimeInput from '@/components/ui/TimeInput'
import dayjs from 'dayjs'

const TimeRangeInput = () => {
    return (
        <TimeInput.TimeInputRange
            clearable
            defaultValue={[
                new Date(),
                dayjs(new Date()).add(60, 'minutes').toDate(),
            ]}
        />
    )
}

export default TimeRangeInput
