```jsx
import { useState } from 'react'
import FormCustomFormatInput from '@/components/shared/FormCustomFormatInput'

const format = (numStr: string) => {
    if (numStr === '') {
      return '';
    }
    const num = parseFloat(numStr); // Parse the string into a number
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);
};

const Simple = () => {
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
        <FormCustomFormatInput
            value={value}
            format={format}
            onValueChange={handleValueChange}
        />
    )
}

export default Simple
```
