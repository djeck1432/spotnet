import { forwardRef } from 'react'
import classNames from 'classnames'
import Line from './Line'
import Circle from './Circle'
import { useConfig } from '../ConfigProvider'
import { SIZES, DIRECTIONS } from '../utils/constants'
import type { CommonProps } from '../@types/common'
import type { StrokeLinecap, GapPosition } from './Circle'
import type { ReactNode } from 'react'

export interface ProgressProps extends CommonProps {
    customInfo?: string | ReactNode
    color?: string
    gapDegree?: number
    gapPosition?: GapPosition
    percent?: number
    showInfo?: boolean
    size?: 'sm' | 'md'
    strokeLinecap?: StrokeLinecap
    strokeWidth?: number
    width?: string | number
    variant?: 'line' | 'circle'
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>((props, ref) => {
    const {
        className,
        customInfo,
        color,
        gapDegree = 0,
        gapPosition = DIRECTIONS.TOP,
        percent = 0,
        showInfo = true,
        size = SIZES.MD,
        strokeLinecap = 'round',
        strokeWidth = 6,
        width = 120,
        variant = 'line',
    } = props

    const { themeColor, primaryColorLevel } = useConfig()

    const renderProcessInfo = () => {
        if (!showInfo) {
            return null
        }
        return (
            <span className={`progress-info ${variant}`}>
                {customInfo || `${percent}%`}
            </span>
        )
    }

    const strokeColor = color || `${themeColor}-${primaryColorLevel}`

    const progressClass = classNames(
        'progress',
        className,
        variant === 'circle' ? 'circle' : 'line',
    )

    const renderProgress = () => {
        const progressInfo = renderProcessInfo()
        let progress

        if (variant === 'line') {
            progress = (
                <Line
                    percent={percent}
                    size={size}
                    strokeColor={strokeColor}
                    {...props}
                >
                    {progressInfo}
                </Line>
            )
        }

        if (variant === 'circle') {
            progress = (
                <Circle
                    gapDegree={gapDegree}
                    gapPosition={gapPosition as GapPosition}
                    percent={percent}
                    strokeColor={strokeColor}
                    strokeLinecap={strokeLinecap}
                    strokeWidth={strokeWidth}
                    width={width}
                    {...props}
                >
                    {progressInfo}
                </Circle>
            )
        }

        return progress
    }

    return (
        <div ref={ref} className={progressClass}>
            {renderProgress()}
        </div>
    )
})

Progress.displayName = 'Progress'

export default Progress
