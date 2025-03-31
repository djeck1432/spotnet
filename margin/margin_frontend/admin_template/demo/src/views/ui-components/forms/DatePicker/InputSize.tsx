import DatePicker from '@/components/ui/DatePicker'

const InputSize = () => {
    const date = new Date()

    return (
        <div>
            <DatePicker
                className="mb-4"
                placeholder="Select a date"
                defaultValue={date}
                size="sm"
            />
            <DatePicker
                className="mb-4"
                placeholder="Select a date"
                defaultValue={date}
            />
            <DatePicker
                className="mb-4"
                placeholder="Select a date"
                defaultValue={date}
                size="lg"
            />
        </div>
    )
}

export default InputSize
