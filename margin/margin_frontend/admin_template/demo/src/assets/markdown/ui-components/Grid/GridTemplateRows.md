```jsx
import DemoBoxContent from '@/components/docs/DemoBoxContent'

const GridTemplateRows = () => {
    return (
        <div className="grid grid-rows-4 grid-flow-col gap-4">
            {[...Array(9).keys()].map((elm) => (
                <DemoBoxContent key={elm} className="shadow-lg bg-pink-500">
                    {'0' + (elm + 1)}
                </DemoBoxContent>
            ))}
        </div>
    )
}

export default GridTemplateRows
```
