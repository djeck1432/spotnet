```jsx
import Spinner from '@/components/ui/Spinner'

export const Size = () => {
    return (
        <div className="flex items-center">
            <Spinner className="mr-4" size={30} />
            <Spinner className="mr-4" size="40px" />
            <Spinner size="3.25rem" />
        </div>
    )
}

export default Size
```
