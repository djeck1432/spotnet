import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import _TimeInput, { TimeInputProps } from './TimeInput'
import TimeInputRange from './TimeInputRange'

export type { TimeInputProps } from './TimeInput'
export type { TimeInputRangeProps } from './TimeInputRange'

type CompoundedComponent = ForwardRefExoticComponent<
    TimeInputProps & RefAttributes<HTMLSpanElement>
> & {
    TimeInputRange: typeof TimeInputRange
}

const TimeInput = _TimeInput as CompoundedComponent

TimeInput.TimeInputRange = TimeInputRange

export { TimeInput }

export default TimeInput
