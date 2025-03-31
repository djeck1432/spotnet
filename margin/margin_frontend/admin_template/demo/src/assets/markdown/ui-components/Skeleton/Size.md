```jsx
import Skeleton from '@/components/ui/Skeleton'

const Size = () => {
    return (
        <div className="flex flex-col gap-4" style={{ maxWidth: 300 }}>
            <Skeleton height={150} />
            <div className="flex flex-auto items-center gap-2">
                <div>
                    <Skeleton variant="circle" height={35} width={35} />
                </div>
                <div className="flex flex-col gap-4 w-full">
                    <Skeleton height={10} />
                    <Skeleton height={10} width="60%" />
                </div>
            </div>
        </div>
    )
}

export default Size
```
