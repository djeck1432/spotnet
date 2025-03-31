import { useState, useRef, forwardRef } from 'react'
import useUniqueId from '../hooks/useUniqueId'
import useMergedRef from '../hooks/useMergeRef'
import useDidUpdate from '../hooks/useDidUpdate'
import TimeInput from './TimeInput'
import CloseButton from '../CloseButton'
import { HiOutlineClock } from 'react-icons/hi'
import Input from '../Input/Input'
import type { CommonProps, TypeAttributes } from '../@types/common'
import type { RefObject, Ref, ReactNode } from 'react'

type Value = [Date | null, Date | null]

export interface TimeInputRangeProps extends CommonProps {
    amLabel?: string
    amPmPlaceholder?: string
    clearable?: boolean
    defaultValue?: Value
    disabled?: boolean
    format?: '12' | '24'
    id?: string
    invalid?: boolean
    name?: string
    nextRef?: RefObject<HTMLInputElement>
    onChange?: (value: Value) => void
    pmLabel?: string
    prefix?: string | ReactNode
    showSeconds?: boolean
    seperator?: string
    size?: TypeAttributes.ControlSize
    suffix?: string | ReactNode
    timeFieldPlaceholder?: string
    timeFieldClass?: string
    value?: Value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field?: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form?: any
}

const TimeInputRange = forwardRef<HTMLInputElement, TimeInputRangeProps>(
    (props, ref) => {
        const {
            amPmPlaceholder = 'am',
            clearable = false,
            className,
            defaultValue = [null, null],
            disabled = false,
            format = '24',
            id,
            invalid,
            name,
            onChange,
            prefix,
            seperator = '~',
            showSeconds = false,
            size,
            style,
            suffix = <HiOutlineClock className="text-lg" />,
            timeFieldPlaceholder = '--',
            value,
            ...rest
        } = props

        const uuid = useUniqueId(id)

        const fromTimeRef = useRef<HTMLInputElement>()
        const toTimeRef = useRef<HTMLInputElement>()
        const [_value, setValue] = useState(value ?? defaultValue)

        useDidUpdate(() => {
            typeof onChange === 'function' && onChange(_value)
        }, [_value])

        useDidUpdate(() => {
            if (
                value &&
                (value[0]?.getTime() !== _value[0]?.getTime() ||
                    value[1]?.getTime() !== _value[1]?.getTime())
            ) {
                setValue(value)
            }
        }, [value])

        const handleClear = () => {
            setValue([null, null])
            fromTimeRef.current?.focus()
        }

        const suffixSlot =
            clearable && _value ? (
                <CloseButton onClick={handleClear} />
            ) : (
                <>{suffix}</>
            )

        const forwardProps = {
            amPmPlaceholder,
            disabled,
            format,
            size,
            timeFieldPlaceholder,
            showSeconds,
        }

        return (
            <Input
                asElement="div"
                invalid={invalid}
                size={size}
                className={className}
                style={style}
                disabled={disabled}
                suffix={suffixSlot}
                prefix={prefix}
                onClick={() => {
                    fromTimeRef.current?.focus()
                }}
                {...rest}
            >
                <div className="time-input-wrapper">
                    <TimeInput
                        ref={useMergedRef(
                            fromTimeRef as Ref<HTMLInputElement>,
                            ref,
                        )}
                        unstyle
                        value={_value[0]}
                        name={name}
                        nextRef={toTimeRef as RefObject<HTMLInputElement>}
                        id={uuid}
                        clearable={false}
                        suffix={null}
                        onChange={(date) => setValue([date, _value[1]])}
                        {...forwardProps}
                    />

                    <span className="time-input-separator">{seperator}</span>

                    <TimeInput
                        ref={toTimeRef as Ref<HTMLInputElement>}
                        unstyle
                        value={_value[1]}
                        clearable={false}
                        suffix={null}
                        onChange={(date) => setValue([_value[0], date])}
                        {...forwardProps}
                    />
                </div>
            </Input>
        )
    },
)

TimeInputRange.displayName = 'TimeInputRange'

export default TimeInputRange
