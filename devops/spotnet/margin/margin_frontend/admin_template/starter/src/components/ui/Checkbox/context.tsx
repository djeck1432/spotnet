import { createContext } from 'react'

export type CheckboxValue = string | number
export type CheckboxGroupValue = CheckboxValue[]

export interface CheckboxGroupContextProps {
    color?: string
    name?: string
    onChange?: (
        value: CheckboxValue,
        checked: boolean,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => void
    value?: CheckboxGroupValue
    vertical?: boolean
}

const CheckboxGroupContext = createContext<CheckboxGroupContextProps>({})

export const CheckboxGroupContextProvider = CheckboxGroupContext.Provider

export default CheckboxGroupContext
