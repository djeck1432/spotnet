import { createContext, useContext } from 'react'

export type TabsVariant = 'underline' | 'pill'

export type TabsValue = string

type TabsContextProps = {
    onValueChange?: (tabValue: string) => void
    value?: TabsValue
    variant?: TabsVariant
}

const TabsContext = createContext<TabsContextProps>({})

export const TabsContextProvider = TabsContext.Provider

export const TabsContextConsumer = TabsContext.Consumer

export function useTabs() {
    return useContext(TabsContext)
}

export default TabsContext
