import { useState } from 'react'
import Select from '@/components/ui/Select'

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

const LoadOptionOnExpand = () => {
    const [options, setOptions] = useState<Option[]>([])
    const [loading, setLoading] = useState(false)

    const promiseOptions = () => {
        setTimeout(() => {
            setOptions(colourOptions)
            setLoading(false)
        }, 1500)
    }

    const onFocus = () => {
        if (options.length === 0) {
            setLoading(true)
            promiseOptions()
        }
    }

    return (
        <div>
            <Select options={options} isLoading={loading} onFocus={onFocus} />
        </div>
    )
}

export default LoadOptionOnExpand
