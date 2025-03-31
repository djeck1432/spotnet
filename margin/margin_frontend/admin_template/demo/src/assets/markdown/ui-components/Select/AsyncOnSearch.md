```jsx
import React, { useState } from 'react'
import Select from '@/components/ui/Select'
import AsyncSelect from 'react-select/async'

const colourOptions = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
    { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
    { value: 'purple', label: 'Purple', color: '#5243AA' },
    { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
    { value: 'forest', label: 'Forest', color: '#00875A' },
    { value: 'slate', label: 'Slate', color: '#253858' },
    { value: 'silver', label: 'Silver', color: '#666666' },
]

const filterColors = (inputValue) => {
    return colourOptions.filter((i) =>
        i.label.toLowerCase().includes(inputValue.toLowerCase()),
    )
}

const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
        callback(filterColors(inputValue))
    }, 1000)
}

const AsyncOnSearch = () => {
    const [_, setValue] = useState('')

    const handleInputChange = (newValue) => {
        const inputValue = newValue.replace(/\W/g, '')
        setValue(inputValue)
        return inputValue
    }

    console.log(_)

    return (
        <div>
            <Select
                cacheOptions
                loadOptions={loadOptions}
                defaultOptions
                onInputChange={handleInputChange}
                componentAs={AsyncSelect}
            />
        </div>
    )
}

export default AsyncOnSearch
```
