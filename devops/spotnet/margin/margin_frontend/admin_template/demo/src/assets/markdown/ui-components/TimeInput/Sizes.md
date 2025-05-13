```jsx
import TimeInput from '@/components/ui/TimeInput'

const Sizes = () => {
    return (
        <div className="flex flex-col gap-5">
            <TimeInput size="sm" />
            <TimeInput />
            <TimeInput size="lg" />
        </div>
    )
}

export default Sizes
```
