```jsx
import { useState } from 'react'
import Switcher from '@/components/ui/Switcher'

const Controlled = () => {
    const [checked, setChecked] = useState(false)

    const onSwitcherToggle = (val: boolean) => {
        console.log('value', val)
        setChecked(!val)
    }

    return (
        <div>
            <Switcher checked={checked} onChange={onSwitcherToggle} />
        </div>
    )
}

export default Controlled
```
