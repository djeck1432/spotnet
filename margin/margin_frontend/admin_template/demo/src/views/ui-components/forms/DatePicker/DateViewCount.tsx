import DatePicker from '@/components/ui/DatePicker'

const { DatePickerRange } = DatePicker

const DateViewCount = () => {
    return (
        <DatePickerRange dateViewCount={2} placeholder="Multiple date view" />
    )
}

export default DateViewCount
