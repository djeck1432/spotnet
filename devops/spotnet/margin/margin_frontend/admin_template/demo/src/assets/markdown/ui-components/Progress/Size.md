```jsx
import Progress from '@/components/ui/Progress'

const Size = () => {
    return (
        <div className="flex items-center">
            <Progress className="mx-6" size="sm" percent={60} />
            <Progress variant="circle" percent={40} width={80} />
        </div>
    )
}

export default Size
```
