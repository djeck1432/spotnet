import { forwardRef } from 'react'
import classNames from 'classnames'
import type { ComponentPropsWithRef, ElementType } from 'react'

export interface TrProps extends ComponentPropsWithRef<'tr'> {
    asElement?: ElementType
}

const Tr = forwardRef<HTMLElement, TrProps>((props, ref) => {
    const { asElement: Component = 'tr', children, className, ...rest } = props

    const trClass = classNames(Component !== 'tr' && 'tr', className)

    return (
        <Component ref={ref} className={trClass} {...rest}>
            {children}
        </Component>
    )
})

Tr.displayName = 'Tr'

export default Tr
