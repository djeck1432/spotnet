import { forwardRef } from 'react'
import classNames from 'classnames'
import { useTabs } from './context'
import type { CommonProps } from '../@types/common'

export type TabListProps = CommonProps

const TabList = forwardRef<HTMLDivElement, TabListProps>((props, ref) => {
    const { className, children, ...rest } = props

    const { variant } = useTabs()

    const tabListClass = classNames(
        'tab-list',
        `tab-list-${variant}`,
        className,
    )

    return (
        <div ref={ref} role="tablist" className={tabListClass} {...rest}>
            {children}
        </div>
    )
})

TabList.displayName = 'TabList'

export default TabList
