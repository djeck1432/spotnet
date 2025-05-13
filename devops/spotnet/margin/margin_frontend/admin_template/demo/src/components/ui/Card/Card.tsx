import { forwardRef } from 'react'
import classNames from 'classnames'
import { useConfig } from '../ConfigProvider'
import type { CommonProps } from '../@types/common'
import type { ReactNode, ComponentPropsWithRef, MouseEvent } from 'react'

export interface CardProps
    extends CommonProps,
        Omit<ComponentPropsWithRef<'div'>, 'onClick'> {
    clickable?: boolean
    bodyClass?: string
    bordered?: boolean
    header?: string | ReactNode
    headerClass?: string
    headerBorder?: boolean
    headerExtra?: string | ReactNode
    footer?: string | ReactNode
    footerClass?: string
    footerBorder?: boolean
    onClick?: (e: MouseEvent<HTMLDivElement>) => void
}

const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
    const { cardBordered } = useConfig()

    const {
        children,
        className,
        clickable = false,
        bodyClass,
        bordered = cardBordered || false,
        header,
        headerClass,
        headerBorder = true,
        headerExtra,
        footer,
        footerClass,
        footerBorder = true,
        onClick,
        ...rest
    } = props

    const cardClass = classNames(
        'card',
        className,
        bordered ? `card-border` : `card-shadow`,
        clickable && 'cursor-pointer user-select-none',
    )

    const cardBodyClasss = classNames('card-body', bodyClass)
    const cardHeaderClass = classNames(
        'card-header',
        headerBorder && 'card-header-border',
        headerExtra && 'card-header-extra',
        headerClass,
    )
    const cardFooterClass = classNames(
        'card-footer',
        footerBorder && `card-footer-border`,
        footerClass,
    )

    const renderHeader = () => {
        if (typeof header === 'string') {
            return <h4>{header}</h4>
        }
        return <>{header}</>
    }

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        onClick?.(e)
    }

    return (
        <div
            ref={ref}
            className={cardClass}
            role="presentation"
            onClick={handleClick}
            {...rest}
        >
            {header && (
                <div className={cardHeaderClass}>
                    {renderHeader()}
                    {headerExtra && <span>{headerExtra}</span>}
                </div>
            )}
            <div className={cardBodyClasss}>{children}</div>
            {footer && <div className={cardFooterClass}>{footer}</div>}
        </div>
    )
})

Card.displayName = 'Card'

export default Card
