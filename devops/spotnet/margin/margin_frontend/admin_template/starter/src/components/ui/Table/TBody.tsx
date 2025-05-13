import { forwardRef } from 'react'
import classNames from 'classnames'
import type { ComponentPropsWithRef, ElementType } from 'react'

export interface TBodyProps extends ComponentPropsWithRef<'tbody'> {
    asElement?: ElementType
}

const TBody = forwardRef<HTMLElement, TBodyProps>((props, ref) => {
    const {
        asElement: Component = 'tbody',
        children,
        className,
        ...rest
    } = props

    const tBodyClass = classNames(Component !== 'tbody' && 'tbody', className)

    return (
        <Component className={tBodyClass} {...rest} ref={ref}>
            {children}
        </Component>
    )
})

TBody.displayName = 'TBody'

export default TBody
