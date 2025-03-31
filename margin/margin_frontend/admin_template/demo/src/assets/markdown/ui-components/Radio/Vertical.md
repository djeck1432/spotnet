```jsx
import { useState } from 'react'
import Radio from '@/components/ui/Radio'

const Vertical = () => {
    const [value, setValue] = useState('Banana')

    const onChange = (val: string) => {
        setValue(val)
    }

    return (
        <div>
            <div className="mt-4">
                <Radio.Group vertical value={value} onChange={onChange}>
                    <Radio value={'Apple'}>Apple</Radio>
                    <Radio value={'Banana'}>Banana</Radio>
                    <Radio value={'Cherry'}>Cherry</Radio>
                </Radio.Group>
            </div>
        </div>
    )
}

export default Vertical
```
