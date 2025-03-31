```jsx
import { useState } from 'react'
import Checkbox from '@/components/ui/Checkbox'

const Controlled = () => {
    const [checked, setChecked] = useState(true)

    return (
        <div>
            <Checkbox checked={checked} onChange={setChecked}>
                Checkbox
            </Checkbox>
        </div>
    )
}

export default Controlled
```
