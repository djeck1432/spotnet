import _Radio, { RadioProps } from './Radio'
import Group from './Group'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'

export type { RadioProps } from './Radio'
export type { RadioGroupProps } from './Group'

type CompoundedComponent = ForwardRefExoticComponent<
    RadioProps & RefAttributes<HTMLHtmlElement>
> & {
    Group: typeof Group
}

const Radio = _Radio as CompoundedComponent

Radio.Group = Group

export { Radio }

export default Radio
