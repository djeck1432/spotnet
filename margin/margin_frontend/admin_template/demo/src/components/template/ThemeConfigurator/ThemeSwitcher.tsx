import classNames from 'classnames'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import {
    setThemeColor,
    setThemeColorLevel,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import { HiCheck } from 'react-icons/hi'
import { components } from 'react-select'
import type { ColorLevel } from '@/@types/theme'
import type { ControlProps, OptionProps } from 'react-select'

const { Control } = components

type ColorList = {
    label: string
    value: string
}

type ColorLevelList = {
    label: string
    value: ColorLevel
}

const colorList: ColorList[] = [
    { label: 'Red', value: 'red' },
    { label: 'Orange', value: 'orange' },
    { label: 'Amber', value: 'amber' },
    { label: 'Yellow', value: 'yellow' },
    { label: 'Lime', value: 'lime' },
    { label: 'Green', value: 'green' },
    { label: 'Emerald', value: 'emerald' },
    { label: 'Teal', value: 'teal' },
    { label: 'Cyan', value: 'cyan' },
    { label: 'Sky', value: 'sky' },
    { label: 'Blue', value: 'blue' },
    { label: 'Indigo', value: 'indigo' },
    { label: 'Violet', value: 'violet' },
    { label: 'Purple', value: 'purple' },
    { label: 'Fuchsia', value: 'fuchsia' },
    { label: 'Pink', value: 'pink' },
    { label: 'Rose', value: 'rose' },
]

const colorLevelList: ColorLevelList[] = [
    { label: '400', value: 400 },
    { label: '500', value: 500 },
    { label: '600', value: 600 },
    { label: '700', value: 700 },
    { label: '800', value: 800 },
    { label: '900', value: 900 },
]

const ColorBadge = ({
    className,
    themeColor,
}: {
    className?: string
    themeColor: string
}) => {
    const primaryColorLevel = useAppSelector(
        (state) => state.theme.primaryColorLevel,
    )

    return (
        <Badge
            className={className}
            innerClass={classNames(`bg-${themeColor}-${primaryColorLevel}`)}
        />
    )
}

const CustomSelectOption = ({
    innerProps,
    label,
    data,
    isSelected,
}: OptionProps<ColorList>) => {
    return (
        <div
            className={`flex items-center justify-between p-2 ${
                isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            {...innerProps}
        >
            <div className="flex items-center gap-2">
                <ColorBadge themeColor={data.value} />
                <span>{label}</span>
            </div>
            {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
        </div>
    )
}

const CustomControl = ({ children, ...props }: ControlProps<ColorList>) => {
    const selected = props.getValue()[0]

    const themeColor = useAppSelector((state) => state.theme.themeColor)

    return (
        <Control {...props}>
            {selected && (
                <ColorBadge
                    themeColor={themeColor}
                    className="ltr:ml-4 rtl:mr-4"
                />
            )}
            {children}
        </Control>
    )
}

const ThemeSwitcher = () => {
    const dispatch = useAppDispatch()

    const themeColor = useAppSelector((state) => state.theme.themeColor)
    const primaryColorLevel = useAppSelector(
        (state) => state.theme.primaryColorLevel,
    )

    const onThemeColorChange = ({ value }: ColorList) => {
        dispatch(setThemeColor(value))
    }

    const onThemeColorLevelChange = ({ value }: ColorLevelList) => {
        dispatch(setThemeColorLevel(value))
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            <Select<ColorList>
                size="sm"
                options={colorList}
                components={{
                    Option: CustomSelectOption,
                    Control: CustomControl,
                }}
                value={colorList.filter((color) => color.value === themeColor)}
                onChange={(opt) => onThemeColorChange(opt as ColorList)}
            />
            <Select<ColorLevelList>
                size="sm"
                options={colorLevelList}
                value={colorLevelList.filter(
                    (color) => color.value === primaryColorLevel,
                )}
                onChange={(opt) =>
                    onThemeColorLevelChange(opt as ColorLevelList)
                }
            />
        </div>
    )
}

export default ThemeSwitcher
