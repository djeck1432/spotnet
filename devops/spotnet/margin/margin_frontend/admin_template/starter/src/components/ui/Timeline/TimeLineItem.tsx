import { forwardRef } from 'react'
import classNames from 'classnames'
import type { CommonProps } from '../@types/common'
import type { ReactNode } from 'react'

export interface TimeLineItemProps extends CommonProps {
    isLast?: boolean
    media?: string | ReactNode
}

const TimeLineItem = forwardRef<HTMLLIElement, TimeLineItemProps>(
    (props, ref) => {
        const { children, className, isLast, media } = props

        return (
            <li
                ref={ref}
                className={classNames(
                    'timeline-item',
                    isLast ? 'timeline-item-last' : '',
                    className,
                )}
            >
                <div className="timeline-item-wrapper">
                    <div className="timeline-item-media">
                        <div className="timeline-item-media-content">
                            {media || (
                                <div className="timeline-item-media-default" />
                            )}
                        </div>
                        {!isLast && <div className="timeline-connect" />}
                    </div>
                    <div
                        className={classNames(
                            'timeline-item-content',
                            isLast && 'timeline-item-content-last',
                        )}
                    >
                        {children}
                    </div>
                </div>
            </li>
        )
    },
)

TimeLineItem.displayName = 'TimeLineItem'

export default TimeLineItem
