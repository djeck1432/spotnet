import { forwardRef } from 'react'
import classNames from 'classnames'
import type { CommonProps } from '../@types/common'
import type { ReactNode } from 'react'

export interface TagProps extends CommonProps {
    children: ReactNode
    prefix?: boolean | ReactNode
    prefixClass?: string
    suffix?: boolean | ReactNode
    suffixClass?: string
}

const Tag = forwardRef<HTMLDivElement, TagProps>((props, ref) => {
    const {
        className,
        children,
        prefix,
        suffix,
        prefixClass,
        suffixClass,
        ...rest
    } = props

    return (
        <div ref={ref} className={classNames('tag', className)} {...rest}>
            {prefix && typeof prefix === 'boolean' && (
                <span
                    className={classNames('tag-affix tag-prefix', prefixClass)}
                />
            )}
            {typeof prefix === 'object' && prefix}
            {children}
            {suffix && typeof suffix === 'boolean' && (
                <span
                    className={classNames('tag-affix tag-suffix', suffixClass)}
                />
            )}
            {typeof suffix === 'object' && suffix}
        </div>
    )
})

Tag.displayName = 'Tag'

export default Tag
