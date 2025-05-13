import Select from '@/components/ui/Select'

const colourOptions = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isDisabled: true },
    { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
    { value: 'purple', label: 'Purple', color: '#5243AA' },
    { value: 'red', label: 'Red', color: '#FF5630', isDisabled: true },
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
    { value: 'forest', label: 'Forest', color: '#00875A', isDisabled: true },
    { value: 'slate', label: 'Slate', color: '#253858', isDisabled: true },
    { value: 'silver', label: 'Silver', color: '#666666' },
]

const Disabled = () => {
    return (
        <div>
            <Select
                className="mb-4"
                placeholder="Certain options disabled"
                options={colourOptions}
            />
            <Select
                isDisabled
                className="mb-4"
                placeholder="Please Select"
                defaultValue={colourOptions[2]}
                options={colourOptions}
            />
            <Select
                isDisabled
                isMulti
                defaultValue={[colourOptions[2], colourOptions[3]]}
                options={colourOptions}
            />
        </div>
    )
}

export default Disabled
