import { forwardRef } from 'react'
import classNames from 'classnames'
import { useConfig } from '../ConfigProvider'
import { HiCheck, HiX } from 'react-icons/hi'
import { STEPS_STATUS } from '../utils/constants'
import type { CommonProps, StepStatus } from '../@types/common'
import type { ReactNode } from 'react'

const { COMPLETE, PENDING, IN_PROGRESS, ERROR } = STEPS_STATUS

const STEP_STATUS_ICON = {
    [COMPLETE]: <HiCheck />,
    [PENDING]: null,
    [IN_PROGRESS]: null,
    [ERROR]: <HiX />,
}

export interface StepItemProps extends CommonProps {
    customIcon?: ReactNode | string
    description?: ReactNode | string
    isLast?: boolean
    onStepChange?: () => void
    status?: StepStatus
    stepNumber?: number
    title?: ReactNode | string
    vertical?: boolean
}

const StepItem = forwardRef<HTMLDivElement, StepItemProps>((props, ref) => {
    const {
        className,
        customIcon,
        description,
        isLast,
        onStepChange,
        status,
        stepNumber,
        title,
        vertical,
        ...rest
    } = props

    const { themeColor, primaryColorLevel } = useConfig()

    const color = `${themeColor}-${primaryColorLevel}`

    let stepIcon = (
        <span>{STEP_STATUS_ICON[status as StepStatus] ?? stepNumber}</span>
    )

    if (customIcon) {
        stepIcon = <span>{customIcon}</span>
    }

    const stepItemClass = classNames(
        `step-item step-item-${status}`,
        vertical && 'step-item-vertical',
        className,
    )

    const stepWrapperClass = classNames(
        'step-item-wrapper',
        onStepChange && 'step-clickable',
    )

    const stepIconClass = classNames(
        `step-item-icon step-item-icon-${status}`,
        status === COMPLETE && `bg-${color} text-white`,
        status === ERROR && `step-item-icon-error`,
        status === IN_PROGRESS &&
            `text-${color} dark:text-gray-100 border-${color} step-item-icon-current`,
    )

    const stepConnectClass = classNames(
        'step-connect',
        title && 'ml-2.5 rtl:mr-2.5',
        vertical && 'step-connect-vertical',
        status === COMPLETE ? `bg-${color}` : `inactive`,
    )

    const stepTitleClass = classNames(
        'step-item-title',
        status === ERROR && `step-item-title-error`,
        onStepChange && status !== ERROR && `hover:text-${color}`,
    )

    const handleStepChange = () => {
        onStepChange?.()
    }

    return (
        <div
            className={stepItemClass}
            {...rest}
            ref={ref}
            role="presentation"
            onClick={handleStepChange}
        >
            <div className={stepWrapperClass}>
                <div className={stepIconClass}>{stepIcon}</div>
                {title && (
                    <div className="step-item-content">
                        {title && (
                            <span className={stepTitleClass}>{title}</span>
                        )}
                        {description && vertical && (
                            <span className="step-item-description">
                                {description}
                            </span>
                        )}
                    </div>
                )}
            </div>
            {!isLast && <div className={stepConnectClass} />}
        </div>
    )
})

StepItem.displayName = 'StepItem'

export default StepItem
