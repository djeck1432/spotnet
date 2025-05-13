import classNames from 'classnames'
import { Button } from '../../Button'
import { HiChevronRight, HiChevronLeft } from 'react-icons/hi'
import type { CommonProps } from '../../@types/common'

export interface HeaderProps extends CommonProps {
    hasNext: boolean
    hasPrevious: boolean
    onNext?: () => void
    onPrevious?: () => void
    onNextLevel?: () => void
    label?: string
    nextLevelDisabled?: boolean
    nextLabel?: string
    previousLabel?: string
    preventLevelFocus?: boolean
    renderCenter?: boolean
    preventFocus?: boolean
}

const Header = (props: HeaderProps) => {
    const {
        hasNext,
        hasPrevious,
        onNext,
        onPrevious,
        onNextLevel,
        label,
        nextLevelDisabled,
        nextLabel,
        previousLabel,
        preventLevelFocus = false,
        renderCenter = false,
        preventFocus,
        children,
        className,
        ...rest
    } = props

    const headerLabel = (
        <button
            className="picker-header-label"
            disabled={nextLevelDisabled}
            tabIndex={preventLevelFocus ? -1 : 0}
            type="button"
            onClick={onNextLevel}
            onMouseDown={(event) => preventFocus && event.preventDefault()}
        >
            {label}
        </button>
    )

    const renderChildren = children ? children : headerLabel

    return (
        <div
            className={classNames(
                'picker-header flex items-center justify-between mb-2',
                className,
            )}
            {...rest}
        >
            {!renderCenter && renderChildren}
            <div
                className={classNames(
                    renderCenter && 'justify-between w-full',
                    'flex items-center rtl:flex-row-reverse',
                )}
            >
                <Button
                    type="button"
                    variant="plain"
                    className={classNames(
                        !hasPrevious &&
                            renderCenter &&
                            'opacity-0 cursor-default',
                    )}
                    size="sm"
                    icon={<HiChevronLeft />}
                    disabled={!hasPrevious}
                    aria-label={previousLabel}
                    onClick={onPrevious}
                    onMouseDown={(event) =>
                        preventFocus && event.preventDefault()
                    }
                />
                {renderCenter && renderChildren}
                <Button
                    type="button"
                    variant="plain"
                    className={classNames(
                        !hasNext && renderCenter && 'opacity-0 cursor-default',
                    )}
                    size="sm"
                    icon={<HiChevronRight />}
                    disabled={!hasNext}
                    aria-label={nextLabel}
                    onClick={onNext}
                    onMouseDown={(event) =>
                        preventFocus && event.preventDefault()
                    }
                />
            </div>
        </div>
    )
}

export default Header
