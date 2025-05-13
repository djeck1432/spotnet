import IconWrapper from './IconWrapper'
import {
    VscAccount,
    VscBellDot,
    VscBold,
    VscDebug,
    VscGear,
    VscHome,
    VscMagnet,
    VscPaintcan,
    VscSourceControl,
} from 'react-icons/vsc'

const renderIcon = [
    { render: () => <VscAccount /> },
    { render: () => <VscBellDot /> },
    { render: () => <VscBold /> },
    { render: () => <VscDebug /> },
    { render: () => <VscGear /> },
    { render: () => <VscHome /> },
    { render: () => <VscMagnet /> },
    { render: () => <VscPaintcan /> },
    { render: () => <VscSourceControl /> },
]

const VsCodeIcons = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`vsCodeIcons-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default VsCodeIcons
