import Select from '@/components/ui/Select'

type Option = {
    label: string
    options: {
        value: string
        label: string
        color?: string
        rating?: string
    }[]
}

const groupedOptions: Option[] = [
    {
        label: 'Colours',
        options: [
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
        ],
    },
    {
        label: 'Flavours',
        options: [
            { value: 'vanilla', label: 'Vanilla', rating: 'safe' },
            { value: 'chocolate', label: 'Chocolate', rating: 'good' },
            { value: 'strawberry', label: 'Strawberry', rating: 'wild' },
            {
                value: 'salted-caramel',
                label: 'Salted Caramel',
                rating: 'crazy',
            },
        ],
    },
]

const formatGroupLabel = (data: Option) => (
    <div className="font-bold text-xs uppercase text-gray-800 dark:text-white my-2">
        {data.label}
    </div>
)

const Group = () => {
    return (
        <div>
            <Select
                defaultValue={groupedOptions[0].options[1]}
                options={groupedOptions}
                formatGroupLabel={formatGroupLabel}
            />
        </div>
    )
}

export default Group
