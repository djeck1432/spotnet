```jsx
import DemoBoxContent from '@/components/docs/DemoBoxContent'

const GridAutoflow = () => {
    return (
        <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-3 gap-4">
            <DemoBoxContent className="col-span-2 bg-purple-300 dark:bg-purple-800 dark:text-purple-400">
                01
            </DemoBoxContent>
            <DemoBoxContent className="col-span-2 bg-purple-300 dark:bg-purple-800 dark:text-purple-400">
                02
            </DemoBoxContent>
            <DemoBoxContent className="shadow-lg bg-purple-500">
                03
            </DemoBoxContent>
            <DemoBoxContent className="bg-purple-300 dark:bg-purple-800 dark:text-purple-400">
                04
            </DemoBoxContent>
            <DemoBoxContent className="bg-purple-300 dark:bg-purple-800 dark:text-purple-400">
                05
            </DemoBoxContent>
        </div>
    )
}

export default GridAutoflow
```
