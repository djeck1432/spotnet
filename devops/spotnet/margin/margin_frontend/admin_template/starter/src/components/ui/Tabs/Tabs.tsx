import { forwardRef } from 'react'
import { TabsContextProvider } from './context'
import useControllableState from '../hooks/useControllableState'
import classNames from 'classnames'
import type { CommonProps } from '../@types/common'
import type { TabsVariant, TabsValue } from './context'

export interface TabsProps extends CommonProps {
    defaultValue?: TabsValue
    onChange?: (tabValue: TabsValue) => void
    value?: TabsValue
    variant?: TabsVariant
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>((props, ref) => {
    const {
        className,
        defaultValue,
        onChange,
        value: valueProp,
        variant = 'underline',
        ...rest
    } = props

    const [value, setValue] = useControllableState({
        prop: valueProp,
        onChange: onChange,
        defaultProp: defaultValue,
    })

    const tabsClass = classNames('tabs', className)

    return (
        <TabsContextProvider
            value={{
                value: value,
                onValueChange: setValue,
                variant,
            }}
        >
            <div className={tabsClass} {...rest} ref={ref} />
        </TabsContextProvider>
    )
})

Tabs.displayName = 'Tabs'

export default Tabs
