import Select from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { HiCheck } from 'react-icons/hi'
import { components } from 'react-select'
import type {
    ControlProps,
    OptionProps,
    MultiValueGenericProps,
} from 'react-select'

type Option = {
    value: string
    label: string
    imgPath: string
}

const { MultiValueLabel, Control } = components

const countryOptions: Option[] = [
    { value: 'us', label: 'United State', imgPath: '/img/countries/us.png' },
    { value: 'cn', label: 'China', imgPath: '/img/countries/cn.png' },
    { value: 'jp', label: 'Japan', imgPath: '/img/countries/jp.png' },
    { value: 'fr', label: 'French', imgPath: '/img/countries/fr.png' },
]

const CustomSelectOption = ({
    innerProps,
    label,
    data,
    isSelected,
}: OptionProps<Option>) => {
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

const CustomControl = ({ children, ...props }: ControlProps<Option>) => {
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

const CustomControlMulti = ({
    children,
    ...props
}: MultiValueGenericProps<Option, true>) => {
    const { imgPath } = props.data
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
            <Select<Option>
                options={countryOptions}
                components={{
                    Option: CustomSelectOption,
                    Control: CustomControl,
                }}
                defaultValue={countryOptions[0]}
                className="mb-4"
            />
            <Select<Option, true>
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
