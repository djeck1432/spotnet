```jsx
import React from 'react'
import Avatar from '@/components/ui/Avatar'
import Select from '@/components/ui/Select'
import { HiCheck } from 'react-icons/hi'
import { components } from 'react-select'

const { MultiValueLabel, Control } = components

const countryOptions = [
    { value: 'us', label: 'United State', imgPath: '/img/countries/us.png' },
    { value: 'cn', label: 'China', imgPath: '/img/countries/cn.png' },
    { value: 'jp', label: 'Japan', imgPath: '/img/countries/jp.png' },
    { value: 'fr', label: 'French', imgPath: '/img/countries/fr.png' },
]

const CustomSelectOption = ({ innerProps, label, data, isSelected }) => {
    return (
        <div
            className={`flex items-center justify-between p-2 ${
                isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            {...innerProps}
        >
            <div className="flex items-center">
                <Avatar shape="circle" size={20} src={data.imgPath} />
                <span className="ml-2 rtl:mr-2">{label}</span>
            </div>
            {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
        </div>
    )
}

const CustomControl = ({ children, ...props }) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <Avatar
                    className="ltr:ml-4 rtl:mr-4"
                    shape="circle"
                    size={18}
                    src={selected.imgPath}
                />
            )}
            {children}
        </Control>
    )
}

const CustomControlMulti = ({ children, data, ...props }) => {
    const { imgPath } = data
    return (
        <MultiValueLabel {...props}>
            <div className="inline-flex items-center">
                <Avatar
                    className="mr-2 rtl:ml-2"
                    shape="circle"
                    size={15}
                    src={imgPath}
                />
                {children}
            </div>
        </MultiValueLabel>
    )
}
const Custom = () => {
    return (
        <div>
            <Select
                options={countryOptions}
                components={{
                    Option: CustomSelectOption,
                    Control: CustomControl,
                }}
                defaultValue={countryOptions[0]}
                className="mb-4"
            />
            <Select
                isMulti
                options={countryOptions}
                components={{
                    Option: CustomSelectOption,
                    MultiValueLabel: CustomControlMulti,
                }}
                defaultValue={[countryOptions[1], countryOptions[2]]}
                className="mb-4"
            />
        </div>
    )
}

export default Custom
```
