import IconWrapper from './IconWrapper'
import {
    ImStatsBars,
    ImMagnet,
    ImAirplane,
    ImContrast,
    ImFrustrated,
    ImCheckmark2,
    ImUnderline,
    ImTextColor,
    ImWhatsapp,
} from 'react-icons/im'

const renderIcon = [
    { render: () => <ImStatsBars /> },
    { render: () => <ImMagnet /> },
    { render: () => <ImAirplane /> },
    { render: () => <ImContrast /> },
    { render: () => <ImFrustrated /> },
    { render: () => <ImCheckmark2 /> },
    { render: () => <ImUnderline /> },
    { render: () => <ImTextColor /> },
    { render: () => <ImWhatsapp /> },
]

const IcoMoonFree = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`icoMoonFree-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default IcoMoonFree
