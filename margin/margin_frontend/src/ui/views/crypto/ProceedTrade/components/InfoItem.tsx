import type { ReactNode } from 'react'

type InfoItemProps = {
    label?: string | number
    value?: string | number | ReactNode
}

const InfoItem = ({ label, value }: InfoItemProps) => {
    return (
        <div className="flex items-center justify-between mb-4">
            <span>{label}</span>
            <span className="font-semibold heading-text">{value}</span>
        </div>
    )
}

export default InfoItem
