import { forwardRef } from 'react'
import classNames from 'classnames'
import type { ComponentPropsWithRef, ElementType } from 'react'

export interface THeadProps extends ComponentPropsWithRef<'thead'> {
    asElement?: ElementType
}

const THead = forwardRef<HTMLElement, THeadProps>((props, ref) => {
    const {
        asElement: Component = 'thead',
        children,
        className,
        ...rest
    } = props

    const tHeadClass = classNames(Component !== 'thead' && 'thead', className)

    return (
        <Component className={tHeadClass} {...rest} ref={ref}>
            {children}
        </Component>
    )
})

THead.displayName = 'THead'

export default THead
