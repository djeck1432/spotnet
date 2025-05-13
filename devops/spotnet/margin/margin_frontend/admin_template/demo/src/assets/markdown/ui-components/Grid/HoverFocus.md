```jsx
import DemoBoxContent from '@/components/docs/DemoBoxContent'

const HoverFocus = () => {
    return (
        <div className="grid hover:grid-cols-1 grid-cols-6 gap-4">
            <DemoBoxContent className="shadow-lg bg-violet-500">
                01
            </DemoBoxContent>
            <DemoBoxContent className="shadow-lg bg-violet-500">
                02
            </DemoBoxContent>
            <DemoBoxContent className="shadow-lg bg-violet-500">
                03
            </DemoBoxContent>
        </div>
    )
}

export default HoverFocus
```
