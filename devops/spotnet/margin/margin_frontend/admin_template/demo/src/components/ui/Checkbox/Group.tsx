import { forwardRef, useState, useCallback, useMemo, useEffect } from 'react'
import classNames from 'classnames'
import { CheckboxGroupContextProvider } from './context'
import cloneDeep from 'lodash/cloneDeep'
import remove from 'lodash/remove'
import shallowEqual from '../utils/shallowEqual'
import type { CommonProps } from '../@types/common'
import type { CheckboxGroupValue, CheckboxValue } from './context'
import type { SyntheticEvent } from 'react'

export interface CheckboxGroupProps extends CommonProps {
    color?: string
    name?: string
    onChange?: (value: CheckboxGroupValue, event: SyntheticEvent) => void
    value?: CheckboxGroupValue
    vertical?: boolean
}

const Group = forwardRef<HTMLDivElement, CheckboxGroupProps>((props, ref) => {
    const {
        children,
        className,
        color,
        name,
        onChange,
        value: valueProp,
        vertical,
        ...rest
    } = props

    const [value, setValue] = useState(valueProp)

    const onCheckboxGroupChange = useCallback(
        (
            itemValue: CheckboxValue,
            itemChecked: boolean,
            event: SyntheticEvent,
        ) => {
            const nextValue = cloneDeep(value) || []
            if (itemChecked) {
                nextValue.push(itemValue as never)
            } else {
                remove(nextValue as string[], (i) => shallowEqual(i, itemValue))
            }

            setValue(nextValue)
            onChange?.(nextValue, event)
        },
        [onChange, setValue, value],
    )

    useEffect(() => {
        setValue(valueProp)
    }, [valueProp])

    const checkboxGroupDefaultClass = `inline-flex ${
        vertical ? 'flex-col gap-y-2' : ''
    }`

    const checkBoxGroupClass = classNames(checkboxGroupDefaultClass, className)

    const contextValue = useMemo(
        () => ({
            vertical,
            name,
            value,
            color,
            onChange: onCheckboxGroupChange,
        }),
        [vertical, onCheckboxGroupChange, name, color, value],
    )

    return (
        <CheckboxGroupContextProvider value={contextValue}>
            <div ref={ref} className={checkBoxGroupClass} {...rest}>
                {children}
            </div>
        </CheckboxGroupContextProvider>
    )
})

Group.displayName = 'CheckboxGroup'

export default Group
