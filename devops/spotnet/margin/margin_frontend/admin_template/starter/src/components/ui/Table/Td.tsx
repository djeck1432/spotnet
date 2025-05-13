import { forwardRef } from 'react'
import classNames from 'classnames'
import type { ComponentPropsWithRef, ElementType } from 'react'

export interface TdProps extends ComponentPropsWithRef<'td'> {
    asElement?: ElementType
}

const Td = forwardRef<HTMLElement, TdProps>((props, ref) => {
    const { asElement: Component = 'td', children, className, ...rest } = props

    const tdClass = classNames(Component !== 'td' && 'td', className)

    return (
        <Component ref={ref} className={tdClass} {...rest}>
            {children}
        </Component>
    )
})

Td.displayName = 'Td'

export default Td
