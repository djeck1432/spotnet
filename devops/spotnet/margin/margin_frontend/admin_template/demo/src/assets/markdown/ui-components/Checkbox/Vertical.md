```jsx
import { useState } from 'react'
import Checkbox from '@/components/ui/Checkbox'

const Vertical = () => {
    const [checkboxList] = useState(['Selection A'])

    return (
        <div>
            <div className="flex flex-col mb-5">
                <Checkbox className="mb-2">Checkbox 1</Checkbox>
                <Checkbox>Checkbox 2</Checkbox>
            </div>
            <Checkbox.Group vertical value={checkboxList}>
                <Checkbox value="Selection A">Selection A </Checkbox>
                <Checkbox value="Selection B">Selection B </Checkbox>
                <Checkbox value="Selection C">Selection C </Checkbox>
            </Checkbox.Group>
        </div>
    )
}

export default Vertical
```
