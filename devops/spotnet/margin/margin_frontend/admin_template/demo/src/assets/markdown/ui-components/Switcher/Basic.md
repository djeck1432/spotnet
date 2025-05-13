```jsx
import Switcher from '@/components/ui/Switcher'
import type { ChangeEvent } from 'react'

const Basic = () => {
    const onSwitcherToggle = (val: boolean, e: ChangeEvent) => {
        console.log(val, e)
    }

    return (
        <div>
            <Switcher defaultChecked onChange={onSwitcherToggle} />
        </div>
    )
}

export default Basic
```
