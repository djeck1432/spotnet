import { useRef, forwardRef } from 'react'
import classNames from 'classnames'
import useMergedRef from '../hooks/useMergeRef'
import type { CommonProps } from '../@types/common'
import type {
    FocusEvent,
    MouseEvent,
    KeyboardEvent,
    ChangeEvent,
    Ref,
} from 'react'

interface AmPmInputProps extends CommonProps {
    disabled?: boolean
    amLabel?: string
    onChange: (value: string, triggerShift: boolean) => void
    onFocus?: (e: FocusEvent<HTMLInputElement>) => void
    placeholder?: string
    pmLabel?: string
    value: string | number | readonly string[]
}

const AmPmInput = forwardRef<HTMLInputElement, AmPmInputProps>((props, ref) => {
    const { className, onChange, onFocus, value, amLabel, pmLabel, ...rest } =
        props

    const inputRef = useRef<HTMLInputElement>()

    const handleClick = (event: MouseEvent<HTMLInputElement>) => {
        event.stopPropagation()
        inputRef?.current?.select()
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault()
            onChange(
                value === amLabel ? (pmLabel as string) : (amLabel as string),
                true,
            )
        }
    }

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        typeof onFocus === 'function' && onFocus(event)
        inputRef?.current?.select()
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const lastInputVal = event.target.value.slice(-1).toLowerCase()

        if (lastInputVal === 'p') {
            event.preventDefault()
            onChange(pmLabel as string, true)
            return
        }

        if (lastInputVal === 'a') {
            event.preventDefault()
            onChange(amLabel as string, true)
            return
        }

        onChange(value.toString(), true)
    }

    return (
        <input
            ref={useMergedRef(inputRef as Ref<HTMLInputElement>, ref)}
            type="text"
            value={value}
            className={classNames('time-input-field', 'am-pm-input', className)}
            onClick={handleClick}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            {...rest}
        />
    )
})

AmPmInput.displayName = 'AmPmInput'

export default AmPmInput
