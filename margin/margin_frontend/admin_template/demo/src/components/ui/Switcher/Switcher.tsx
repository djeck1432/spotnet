import { forwardRef, useState, useEffect } from 'react'
import classNames from 'classnames'
import { Spinner } from '../Spinner'
import { useConfig } from '../ConfigProvider'
import type { CommonProps } from '../@types/common'
import type { ReactNode, ChangeEvent } from 'react'

export interface SwitcherProps extends CommonProps {
    checked?: boolean
    checkedContent?: string | ReactNode
    color?: string
    defaultChecked?: boolean
    disabled?: boolean
    isLoading?: boolean
    labelRef?: string
    name?: string
    onChange?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void
    readOnly?: boolean
    unCheckedContent?: string | ReactNode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field?: any
}

const Switcher = forwardRef<HTMLInputElement, SwitcherProps>((props, ref) => {
    const {
        checked,
        checkedContent,
        className,
        color,
        defaultChecked,
        disabled,
        isLoading = false,
        labelRef,
        name,
        onChange,
        readOnly,
        unCheckedContent,
        field,
        ...rest
    } = props

    const { themeColor, primaryColorLevel } = useConfig()

    const [switcherChecked, setSwitcherChecked] = useState(
        defaultChecked || checked,
    )

    useEffect(() => {
        if (typeof checked !== 'undefined') {
            setSwitcherChecked(checked)
        }
    }, [checked])

    const getControlProps = () => {
        let checkedValue = switcherChecked

        let checked: {
            value?: boolean
            defaultChecked?: boolean
            checked?: boolean
        } = {
            value: checkedValue,
        }

        if (field) {
            checkedValue =
                typeof field.value === 'boolean' ? field.value : defaultChecked
            checked = { value: checkedValue, checked: checkedValue }
        }

        if (defaultChecked) {
            checked.defaultChecked = defaultChecked
        }
        return checked
    }

    const controlProps = getControlProps()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const nextChecked = !switcherChecked

        if (disabled || readOnly || isLoading) {
            return
        }

        if (typeof checked === 'undefined') {
            setSwitcherChecked(nextChecked)
            onChange?.(nextChecked, e)
        } else {
            onChange?.(switcherChecked as boolean, e)
        }
    }

    const switcherColor = color || `${themeColor}-${primaryColorLevel}`

    const switcherClass = classNames(
        'switcher',
        (switcherChecked || controlProps.checked) &&
            `switcher-checked bg-${switcherColor} dark:bg-${switcherColor}`,
        disabled && 'switcher-disabled',
        className,
    )

    return (
        <label ref={labelRef} className={switcherClass}>
            <input
                ref={ref}
                type="checkbox"
                disabled={disabled}
                readOnly={readOnly}
                name={name}
                onChange={handleChange}
                {...controlProps}
                {...field}
                {...rest}
            />
            {isLoading ? (
                <Spinner
                    className={classNames(
                        'switcher-toggle-loading',
                        switcherChecked
                            ? 'switcher-checked-loading'
                            : 'switcher-uncheck-loading',
                    )}
                />
            ) : (
                <div className="switcher-toggle" />
            )}
            <span className="switcher-content">
                {switcherChecked ? checkedContent : unCheckedContent}
            </span>
        </label>
    )
})

Switcher.displayName = 'Switcher'

export default Switcher
