import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import _Tabs, { TabsProps } from './Tabs'
import TabList from './TabList'
import TabNav from './TabNav'
import TabContent from './TabContent'

export type { TabsProps } from './Tabs'
export type { TabListProps } from './TabList'
export type { TabNavProps } from './TabNav'
export type { TabContentProps } from './TabContent'

type CompoundedComponent = ForwardRefExoticComponent<
    TabsProps & RefAttributes<HTMLHtmlElement>
> & {
    TabList: typeof TabList
    TabNav: typeof TabNav
    TabContent: typeof TabContent
}

const Tabs = _Tabs as CompoundedComponent

Tabs.TabList = TabList
Tabs.TabNav = TabNav
Tabs.TabContent = TabContent

export { Tabs }

export default Tabs
