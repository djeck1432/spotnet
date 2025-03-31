```jsx
import Progress from '@/components/ui/Progress'

const Circle = () => {
    return (
        <div className="md:inline-flex items-center">
            <Progress
                className="md:mb-0 md:mr-4 mb-4"
                variant="circle"
                percent={40}
            />
            <Progress
                variant="circle"
                percent={70}
                gapDegree={70}
                gapPosition="bottom"
            />
        </div>
    )
}

export default Circle
```
