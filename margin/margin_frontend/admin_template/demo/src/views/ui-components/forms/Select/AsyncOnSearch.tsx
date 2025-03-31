import { useState } from 'react'
import Select from '@/components/ui/Select'
import AsyncSelect from 'react-select/async'

type Option = {
    value: string
    label: string
    color: string
    isFixed?: boolean
    isDisabled?: boolean
}

const colourOptions: Option[] = [
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

const filterColors = (inputValue: string) => {
    return colourOptions.filter((i) =>
        i.label.toLowerCase().includes(inputValue.toLowerCase()),
    )
}

const loadOptions = (
    inputValue: string,
    callback: (options: Option[]) => void,
) => {
    setTimeout(() => {
        const filteredOptions = filterColors(inputValue)
        callback(filteredOptions)
    }, 1000)
}

const AsyncOnSearch = () => {
    const [_, setValue] = useState('')

    const handleInputChange = (newValue: string) => {
        const inputValue = newValue.replace(/\W/g, '')
        setValue(inputValue)
        return inputValue
    }

    console.log(_)

    return (
        <div>
            <Select
                cacheOptions
                defaultOptions
                loadOptions={loadOptions}
                componentAs={AsyncSelect}
                onInputChange={handleInputChange}
            />
        </div>
    )
}

export default AsyncOnSearch
