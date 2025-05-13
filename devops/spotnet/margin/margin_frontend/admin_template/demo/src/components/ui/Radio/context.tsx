import { createContext } from 'react'

type RadioGroupContextProps = {
    vertical?: boolean
    name?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: any
    color?: string
    disabled?: boolean
    radioGutter?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?: (nextValue: any, e: MouseEvent) => void
}

const RadioGroupContext = createContext<RadioGroupContextProps>({})

export const RadioGroupContextProvider = RadioGroupContext.Provider

export default RadioGroupContext
