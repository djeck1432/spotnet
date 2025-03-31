import { useState, useRef, forwardRef } from 'react'
import useUniqueId from '../hooks/useUniqueId'
import useMergedRef from '../hooks/useMergeRef'
import useDidUpdate from '../hooks/useDidUpdate'
import TimeInputField from './TimeInputField'
import AmPmInput from './AmPmInput'
import CloseButton from '../CloseButton'
import { Input } from '../Input'
import {
    getTimeValues,
    getDate,
    createAmPmHandler,
    createTimeHandler,
} from './utils'
import { HiOutlineClock } from 'react-icons/hi'
import type { CommonProps, TypeAttributes } from '../@types/common'
import type { ReactNode, RefObject, Ref } from 'react'

type Value = Date | null

export interface TimeInputProps extends CommonProps {
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
    size?: TypeAttributes.ControlSize
    suffix?: string | ReactNode
    timeFieldPlaceholder?: string
    timeFieldClass?: string
    unstyle?: boolean
    value?: Value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field?: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form?: any
}

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>((props, ref) => {
    const {
        amLabel = 'am',
        amPmPlaceholder = 'am',
        className,
        clearable = true,
        defaultValue,
        disabled = false,
        format = '24',
        field,
        form,
        id,
        invalid,
        name,
        nextRef,
        onChange,
        pmLabel = 'pm',
        prefix,
        showSeconds = false,
        size = 'md',
        style,
        suffix = <HiOutlineClock className="text-lg" />,
        timeFieldPlaceholder = '--',
        timeFieldClass,
        value,
        ...rest
    } = props

    const uuid = useUniqueId(id)

    const hoursRef = useRef<HTMLInputElement>()
    const minutesRef = useRef<HTMLInputElement>()
    const secondsRef = useRef<HTMLInputElement>()
    const amPmRef = useRef<HTMLInputElement>()
    const [time, setTime] = useState(
        getTimeValues(
            value || (defaultValue as Date),
            format,
            amLabel,
            pmLabel,
        ),
    )
    const [_value, setValue] = useState<Value>(
        (value as Date) || (defaultValue as Date),
    )

    useDidUpdate(() => {
        setTime(getTimeValues(_value as Date, format, amLabel, pmLabel))
    }, [_value, format, amLabel, pmLabel])

    useDidUpdate(() => {
        if (value?.getTime() !== _value?.getTime()) {
            setValue(value as Date | null)
        }
    }, [value])

    const setDate = (change: Partial<typeof time>) => {
        const timeWithChange = { ...time, ...change }
        const newDate = getDate(
            timeWithChange.hours,
            timeWithChange.minutes,
            timeWithChange.seconds,
            format,
            pmLabel,
            timeWithChange.amPm,
        )
        setValue(newDate)
        typeof onChange === 'function' && onChange(newDate)
    }

    const handleHoursChange = createTimeHandler({
        onChange: (val, carryOver) => {
            setDate({
                hours: val,
                minutes: carryOver ?? time.minutes,
            })
        },
        min: format === '12' ? 1 : 0,
        max: format === '12' ? 12 : 23,
        nextRef: minutesRef as RefObject<HTMLInputElement>,
        nextMax: 59,
    })

    const handleMinutesChange = createTimeHandler({
        onChange: (val, carryOver) => {
            setDate({
                minutes: val,
                seconds: carryOver ?? time.seconds,
            })
        },
        min: 0,
        max: 59,
        nextRef: showSeconds
            ? (secondsRef as RefObject<HTMLInputElement>)
            : format === '12'
              ? (amPmRef as RefObject<HTMLInputElement>)
              : (nextRef as RefObject<HTMLInputElement>),
        nextMax: showSeconds ? 59 : undefined,
    })

    const handleSecondsChange = createTimeHandler({
        onChange: (val) => {
            setDate({ seconds: val })
        },
        min: 0,
        max: 59,
        nextRef:
            format === '12'
                ? (amPmRef as RefObject<HTMLInputElement>)
                : (nextRef as RefObject<HTMLInputElement>),
    })

    const handleAmPmChange = createAmPmHandler({
        amLabel,
        pmLabel,
        onChange: (val) => {
            setDate({ amPm: val })
        },
        nextRef,
    })

    const handleClear = () => {
        setTime({ hours: '', minutes: '', seconds: '', amPm: '' })
        setValue(null)
        onChange?.(null)
        hoursRef?.current?.focus()
    }

    const suffixSlot =
        clearable && _value ? <CloseButton onClick={handleClear} /> : suffix

    return (
        <Input
            asElement="div"
            invalid={invalid}
            disabled={disabled}
            style={style}
            className={className}
            size={size}
            prefix={prefix}
            suffix={suffixSlot}
            field={field}
            form={form}
            onClick={() => hoursRef?.current?.focus()}
            {...rest}
        >
            <div className="time-input-wrapper">
                <TimeInputField
                    ref={useMergedRef(hoursRef as Ref<HTMLInputElement>, ref)}
                    withSeparator
                    value={time.hours}
                    setValue={(val) =>
                        setTime((current) => ({ ...current, hours: val }))
                    }
                    id={uuid + '-0'}
                    className={timeFieldClass}
                    max={format === '12' ? 12 : 23}
                    placeholder={timeFieldPlaceholder}
                    aria-label="hours"
                    disabled={disabled}
                    name={name}
                    onChange={handleHoursChange}
                />
                <TimeInputField
                    ref={minutesRef as Ref<HTMLInputElement>}
                    value={time.minutes}
                    setValue={(val) =>
                        setTime((current) => ({ ...current, minutes: val }))
                    }
                    id={uuid + '-1'}
                    className={timeFieldClass}
                    withSeparator={showSeconds}
                    max={59}
                    placeholder={timeFieldPlaceholder}
                    aria-label="minutes"
                    disabled={disabled}
                    onChange={handleMinutesChange}
                />
                {showSeconds && (
                    <TimeInputField
                        ref={secondsRef as Ref<HTMLInputElement>}
                        value={time.seconds}
                        setValue={(val) =>
                            setTime((current) => ({ ...current, seconds: val }))
                        }
                        id={uuid + '-2'}
                        className={timeFieldClass}
                        max={59}
                        placeholder={timeFieldPlaceholder}
                        aria-label="seconds"
                        disabled={disabled}
                        onChange={handleSecondsChange}
                    />
                )}
                {format === '12' && (
                    <AmPmInput
                        ref={amPmRef as Ref<HTMLInputElement>}
                        value={time.amPm}
                        placeholder={amPmPlaceholder}
                        amLabel={amLabel}
                        pmLabel={pmLabel}
                        aria-label="am pm"
                        disabled={disabled}
                        onChange={handleAmPmChange}
                    />
                )}
            </div>
        </Input>
    )
})

TimeInput.displayName = 'TimeInput'

export default TimeInput
