import { forwardRef } from 'react'
import classNames from 'classnames'
import type { CommonProps } from '../@types/common'
import type { CSSProperties } from 'react'

export interface BadgeProps extends CommonProps {
    badgeStyle?: CSSProperties
    content?: string | number
    innerClass?: string
    maxCount?: number
}

const Badge = forwardRef<HTMLElement, BadgeProps>((props, ref) => {
    const {
        badgeStyle,
        children,
        className,
        content,
        innerClass,
        maxCount = 99,
        ...rest
    } = props

    const dot = typeof content !== 'number' && typeof content !== 'string'

    const badgeClass = classNames(dot ? 'badge-dot' : 'badge', innerClass)

    const renderBadge = () => {
        if (children) {
            return (
                <span
                    ref={ref}
                    className={classNames('badge-wrapper', className)}
                    {...rest}
                >
                    <span
                        className={classNames(badgeClass, 'badge-inner')}
                        style={badgeStyle}
                    >
                        {typeof content === 'number' && content > maxCount
                            ? `${maxCount}+`
                            : content}
                    </span>
                    {children}
                </span>
            )
        }
        return (
            <span
                ref={ref}
                className={classNames(badgeClass, className)}
                style={badgeStyle}
                {...rest}
            >
                {content}
            </span>
        )
    }

    return renderBadge()
})

Badge.displayName = 'Badge'

export default Badge
