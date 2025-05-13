import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import _Timeline, { TimelineProps } from './Timeline'
import TimeLineItem from './TimeLineItem'

export type { TimelineProps } from './Timeline'
export type { TimeLineItemProps } from './TimeLineItem'

type CompoundedComponent = ForwardRefExoticComponent<
    TimelineProps & RefAttributes<HTMLUListElement>
> & {
    Item: typeof TimeLineItem
}

const Timeline = _Timeline as CompoundedComponent

Timeline.Item = TimeLineItem

export { Timeline }

export default Timeline
