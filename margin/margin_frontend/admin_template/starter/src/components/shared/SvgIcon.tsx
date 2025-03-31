import { forwardRef } from 'react'
import classNames from 'classnames'
import type { CommonProps } from '@/@types/common'

const SvgIcon = forwardRef<HTMLSpanElement, CommonProps>((props, ref) => {
    const { children, className, ...rest } = props

    return (
        <span
            ref={ref}
            className={classNames('inline-flex', className)}
            {...rest}
        >
            {children}
        </span>
    )
})

SvgIcon.displayName = 'SvgIcon'

export default SvgIcon
