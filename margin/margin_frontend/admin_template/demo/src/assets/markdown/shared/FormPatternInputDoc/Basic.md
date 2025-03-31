```jsx
import { useState } from 'react'
import FormPatternInput from '@/components/shared/FormPatternInput'

const Basic = () => {
    const [value, setValue] = useState(0)

    const handleValueChange = (e: {
        floatValue?: number
        formattedValue: string
        value: string
    }) => {
        console.log(e)
        setValue(e.floatValue as number)
    }

    return (
        <FormPatternInput
            value={value}
            format="### ###"
            onValueChange={handleValueChange}
        />
    )
}

export default Basic
```
