```jsx
import React from 'react'
import Select from '@/components/ui/Select'
import CreatableSelect from 'react-select/creatable'

const colourOptions = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9' },
    { value: 'blue', label: 'Blue', color: '#0052CC' },
    { value: 'purple', label: 'Purple', color: '#5243AA' },
    { value: 'red', label: 'Red', color: '#FF5630' },
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
    { value: 'forest', label: 'Forest', color: '#00875A' },
    { value: 'slate', label: 'Slate', color: '#253858' },
    { value: 'silver', label: 'Silver', color: '#666666' },
]

const Creatable = () => {
    const handleChange = (newValue, actionMeta) => {
        console.group('Value Changed')
        console.log(newValue)
        console.log(`action: ${actionMeta.action}`)
        console.groupEnd()
    }

    const handleInputChange = (inputValue, actionMeta) => {
        console.group('Input Changed')
        console.log(inputValue)
        console.log(`action: ${actionMeta.action}`)
        console.groupEnd()
    }

    return (
        <div>
            <Select
                isClearable
                onChange={handleChange}
                placeholder="Type something..."
                onInputChange={handleInputChange}
                componentAs={CreatableSelect}
                options={colourOptions}
            />
        </div>
    )
}

export default Creatable
```
