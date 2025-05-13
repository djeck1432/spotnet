import classNames from 'classnames'
import { SIZES } from '../utils/constants'
import type { CommonProps } from '../@types/common'

interface LineProps extends CommonProps {
    percent: number
    strokeColor?: string
    size?: 'sm' | 'md'
}

const Line = (props: LineProps) => {
    const { percent, size, children, strokeColor } = props

    const progressBackgroundClass = classNames(
        'progress-bg',
        size === SIZES.SM ? 'h-1.5' : 'h-2',
        `bg-${strokeColor}`,
    )

    return (
        <>
            <div className="progress-wrapper">
                <div className="progress-inner">
                    <div
                        className={progressBackgroundClass}
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>
            {children}
        </>
    )
}

Line.displayName = 'ProgressLine'

export default Line
