```jsx
import { useState } from 'react'
import FormNumericInput from '@/components/shared/FormNumericInput'

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
        <FormNumericInput
            fixedDecimalScale
            value={value}
            decimalScale={2}
            onValueChange={handleValueChange}
        />
    )
}

export default Basic
```
