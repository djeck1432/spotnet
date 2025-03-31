```jsx
import Checkbox from '@/components/ui/Checkbox'
import type { ChangeEvent } from 'react'

const Default = () => {
    const onCheck = (value: boolean, e: ChangeEvent<HTMLInputElement>) => {
        console.log(value, e)
    }

    return (
        <div>
            <Checkbox defaultChecked onChange={onCheck}>
                Checkbox
            </Checkbox>
        </div>
    )
}

export default Default
```
