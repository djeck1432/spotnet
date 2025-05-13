```jsx
import DemoBoxContent from '@/components/docs/DemoBoxContent'

const GridAutoColumns = () => {
    return (
        <div className="grid grid-flow-col auto-cols-max gap-4">
            <DemoBoxContent className="shadow-lg bg-emerald-500">
                01
            </DemoBoxContent>
            <DemoBoxContent className="shadow-lg bg-emerald-500">
                02
            </DemoBoxContent>
            <DemoBoxContent className="shadow-lg bg-emerald-500">
                03
            </DemoBoxContent>
        </div>
    )
}

export default GridAutoColumns
```
