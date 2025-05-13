import { forwardRef, useContext, useCallback, useState } from 'react'
import classNames from 'classnames'
import CheckboxGroupContext from './context'
import { useConfig } from '../ConfigProvider'
import type { CommonProps } from '../@types/common'
import type { CheckboxValue } from './context'
import type { ChangeEvent } from 'react'

export interface CheckboxProps extends CommonProps {
    checked?: boolean
    color?: string
    defaultChecked?: boolean
    disabled?: boolean
    labelRef?: string
    name?: string
    onChange?: (values: boolean, e: ChangeEvent<HTMLInputElement>) => void
    readOnly?: boolean
    value?: CheckboxValue
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    field?: any
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
    const {
        name: nameContext,
        value: groupValue,
        onChange: onGroupChange,
        color: colorContext,
    } = useContext(CheckboxGroupContext)

    const {
        color,
        className,
        onChange,
        children,
        disabled,
        readOnly,
        name = nameContext,
        defaultChecked,
        value,
        checked: controlledChecked,
        labelRef,
        field,
        ...rest
    } = props

    const { themeColor, primaryColorLevel } = useConfig()

    const isChecked = useCallback(() => {
        if (typeof groupValue !== 'undefined' && typeof value !== 'undefined') {
            return groupValue.some((i) => i === value)
        }
        return controlledChecked || defaultChecked
    }, [controlledChecked, groupValue, value, defaultChecked])

    const [checkboxChecked, setCheckboxChecked] = useState(isChecked())

    const getControlProps = () => {
        let checkedValue = checkboxChecked

        let groupChecked = { checked: checkedValue }
        let singleChecked: {
            value: boolean
            defaultChecked?: boolean
            checked?: boolean
        } = {
            value: checkedValue as boolean,
        }

        if (typeof controlledChecked !== 'undefined') {
            singleChecked.checked = controlledChecked
        }

        if (field) {
            checkedValue =
                typeof field.value === 'boolean' ? field.value : defaultChecked
            singleChecked = {
                value: checkedValue as boolean,
                checked: checkedValue,
            }
        }

        if (typeof groupValue !== 'undefined') {
            groupChecked = { checked: groupValue.includes(value as never) }
        }

        if (defaultChecked) {
            singleChecked.defaultChecked = defaultChecked
        }
        return typeof groupValue !== 'undefined' ? groupChecked : singleChecked
    }

    const controlProps = getControlProps()

    const onCheckboxChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            let nextChecked = !checkboxChecked

            if (typeof groupValue !== 'undefined') {
                nextChecked = !groupValue.includes(value as never)
            }

            if (disabled || readOnly) {
                return
            }

            setCheckboxChecked(nextChecked)
            onChange?.(nextChecked, e)
            onGroupChange?.(value as CheckboxValue, nextChecked, e)
        },
        [
            checkboxChecked,
            disabled,
            readOnly,
            setCheckboxChecked,
            onChange,
            value,
            onGroupChange,
            groupValue,
        ],
    )

    const checkboxColor =
        color || colorContext || `${themeColor}-${primaryColorLevel}`

    const checkboxDefaultClass = `checkbox text-${checkboxColor}`
    const checkboxColorClass = disabled && 'disabled'
    const labelDefaultClass = `checkbox-label`
    const labelDisabledClass = disabled && 'disabled'

    const checkBoxClass = classNames(checkboxDefaultClass, checkboxColorClass)

    const labelClass = classNames(
        labelDefaultClass,
        labelDisabledClass,
        className,
    )

    return (
        <label ref={labelRef} className={labelClass}>
            <input
                ref={ref}
                className={checkBoxClass}
                type="checkbox"
                disabled={disabled}
                readOnly={readOnly}
                name={name}
                onChange={onCheckboxChange}
                {...controlProps}
                {...field}
                {...rest}
            />
            {children ? (
                <span
                    className={classNames(
                        'ltr:ml-2 rtl:mr-2',
                        disabled ? 'opacity-50' : '',
                    )}
                >
                    {children}
                </span>
            ) : null}
        </label>
    )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox
