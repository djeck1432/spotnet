import { useRef, useState, useEffect } from 'react'
import classNames from 'classnames'
import type { CommonProps } from '@/@types/common'
import type { HTMLAttributes } from 'react'

interface StickyFooterProps
    extends CommonProps,
        HTMLAttributes<HTMLDivElement> {
    stickyClass?: string
}

const StickyFooter = (props: StickyFooterProps) => {
    const { children, className, stickyClass, ...rest } = props

    const [isSticky, setIsSticky] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const cachedRef = ref.current
        const observer = new IntersectionObserver(
            ([e]) => setIsSticky(e.intersectionRatio < 1),
            {
                threshold: [1],
            },
        )

        observer.observe(cachedRef as Element)

        return function () {
            observer.unobserve(cachedRef as Element)
        }
    }, [])

    return (
        <div
            ref={ref}
            className={classNames(
                'sticky -bottom-1',
                className,
                isSticky && stickyClass,
            )}
            {...rest}
        >
            {children}
        </div>
    )
}

export default StickyFooter
