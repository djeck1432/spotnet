import { forwardRef, Children } from 'react'
import classNames from 'classnames'
import { STEPS_STATUS } from '../utils/constants'
import mapCloneElement from '../utils/mapCloneElement'
import type { CommonProps, StepStatus } from '../@types/common'
import type { StepItemProps } from './StepItem'

const { COMPLETE, PENDING, IN_PROGRESS, ERROR } = STEPS_STATUS

export interface StepsProps extends CommonProps {
    current?: number
    onChange?: (index: number) => void
    status?: StepStatus
    vertical?: boolean
}

const Steps = forwardRef<HTMLDivElement, StepsProps>((props, ref) => {
    const {
        className,
        children,
        vertical = false,
        current = 0,
        status = IN_PROGRESS,
        onChange,
        ...rest
    } = props

    const count = Children.count(children)

    const items = mapCloneElement(
        children,
        (item: { props: StepItemProps }, index: number) => {
            const itemStyles = {
                flexBasis:
                    index < count - 1 ? `${100 / (count - 1)}%` : undefined,
                maxWidth: index === count - 1 ? `${100 / count}%` : undefined,
            }
            const itemProps: StepItemProps = {
                stepNumber: index + 1,
                status: PENDING as StepStatus,
                style: !vertical ? itemStyles : undefined,
                isLast: index === count - 1,
                vertical: vertical,
                onStepChange: onChange ? () => onChange(index) : undefined,
                ...item.props,
            }

            if (status === ERROR && index === (current as number) - 1) {
                itemProps.className = classNames('steps-item-error')
            }

            if (!item.props.status) {
                if (index === current) {
                    itemProps.status = status as StepStatus
                    itemProps.className = classNames(
                        itemProps.className,
                        'steps-item-active',
                    )
                } else if (index < (current as number)) {
                    itemProps.status = COMPLETE as StepStatus
                }
            }
            return itemProps
        },
    )

    return (
        <div
            ref={ref}
            className={classNames(
                'steps',
                vertical && 'steps-vertical',
                className,
            )}
            {...rest}
        >
            {items}
        </div>
    )
})

Steps.displayName = 'Steps'

export default Steps
