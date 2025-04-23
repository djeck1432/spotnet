import { useCallback } from 'react'
import type { CommonProps } from '../@types/common'

export type StrokeLinecap = 'round' | 'square'
export type GapPosition = 'top' | 'right' | 'bottom' | 'left'

interface CircleProps extends CommonProps {
    gapDegree: number
    gapPosition: GapPosition
    percent: number
    strokeColor?: string
    strokeLinecap: StrokeLinecap
    strokeWidth: number
    width?: number | string
}

const Circle = (props: CircleProps) => {
    const {
        strokeWidth,
        percent,
        strokeLinecap,
        gapDegree,
        gapPosition,
        strokeColor,
        width,
        children,
    } = props

    const getPathStyles = useCallback(() => {
        const radius = 50 - strokeWidth / 2

        let beginPositionX = 0
        let beginPositionY = -radius
        let endPositionX = 0
        let endPositionY = -2 * radius

        switch (gapPosition) {
            case 'left':
                beginPositionX = -radius
                beginPositionY = 0
                endPositionX = 2 * radius
                endPositionY = 0
                break
            case 'right':
                beginPositionX = radius
                beginPositionY = 0
                endPositionX = -2 * radius
                endPositionY = 0
                break
            case 'bottom':
                beginPositionY = radius
                endPositionY = 2 * radius
                break
            default:
        }

        const pathString = `M 50,50 m ${beginPositionX},${beginPositionY} a ${radius},${radius} 0 1 1 ${endPositionX},${-endPositionY} a ${radius},${radius} 0 1 1 ${-endPositionX},${endPositionY}`

        const len = Math.PI * 2 * radius
        const trailPathStyle = {
            strokeDasharray: `${len - gapDegree}px ${len}px`,
            strokeDashoffset: `-${gapDegree / 2}px`,
        }

        const strokePathStyle = {
            strokeDasharray: `${
                (percent / 100) * (len - gapDegree)
            }px ${len}px`,
            strokeDashoffset: `-${gapDegree / 2}px`,
        }

        return {
            pathString,
            trailPathStyle,
            strokePathStyle,
        }
    }, [gapDegree, gapPosition, percent, strokeWidth])

    const { pathString, trailPathStyle, strokePathStyle } = getPathStyles()

    const progressStrokeClass = `progress-circle-stroke text-${strokeColor}`

    return (
        <div className="progress-circle" style={{ width: width }}>
            <span className="progress-circle-info">{children}</span>
            <svg viewBox="0 0 100 100">
                <path
                    d={pathString}
                    strokeWidth={strokeWidth}
                    fillOpacity="0"
                    style={trailPathStyle}
                    className="progress-circle-trail"
                />
                <path
                    d={pathString}
                    strokeLinecap={strokeLinecap}
                    strokeWidth={percent === 0 ? 0 : strokeWidth}
                    fillOpacity="0"
                    style={strokePathStyle}
                    className={progressStrokeClass}
                />
            </svg>
        </div>
    )
}

Circle.displayName = 'ProgressCircle'

export default Circle
