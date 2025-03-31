import { forwardRef } from 'react'
import classNames from 'classnames'
import { useTabs } from './context'
import type { CommonProps } from '../@types/common'
import type { TabsValue } from './context'

export interface TabContentProps extends CommonProps {
    value: TabsValue
}

const TabContent = forwardRef<HTMLDivElement, TabContentProps>((props, ref) => {
    const { value, children, className, ...rest } = props

    const context = useTabs()
    const isSelected = value === context.value

    const tabContentClass = classNames(
        'tab-content',
        isSelected && 'tab-content-active',
        className,
    )

    return (
        <div
            ref={ref}
            role="tabpanel"
            tabIndex={0}
            className={tabContentClass}
            {...rest}
        >
            {isSelected && children}
        </div>
    )
})

TabContent.displayName = 'TabContent'

export default TabContent
