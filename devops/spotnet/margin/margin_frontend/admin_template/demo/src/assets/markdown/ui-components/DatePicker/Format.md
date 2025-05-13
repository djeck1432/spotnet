```jsx
import DatePicker from '@/components/ui/DatePicker'

const Format = () => {
    const date = new Date()

    return (
        <div className="flex flex-col gap-4">
            <div>
                <div className="mb-1 font-semibold text-sm">Input format:</div>
                <DatePicker inputFormat="MMM, DD YYYY" defaultValue={date} />
            </div>
            <div>
                <div className="mb-1 font-semibold text-sm">
                    Inner label format:
                </div>
                <DatePicker
                    labelFormat={{
                        month: 'MMMM',
                        year: 'YY',
                    }}
                    defaultValue={date}
                />
            </div>
        </div>
    )
}

export default Format
```
