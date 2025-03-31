import type { ReactNode } from 'react'

type DemoBoxContentProps = {
    children?: ReactNode | string
    className?: string
}

const DemoBoxContent = ({ children, className }: DemoBoxContentProps) => {
    return (
        <div
            className={`p-4 rounded-lg text-center font-semibold text-white ${className}`}
        >
            {children}
        </div>
    )
}

export default DemoBoxContent
