import IconWrapper from './IconWrapper'
import {
    FiBellOff,
    FiCloudLightning,
    FiFeather,
    FiFramer,
    FiPenTool,
    FiHeadphones,
    FiSpeaker,
    FiUmbrella,
    FiZap,
} from 'react-icons/fi'

const renderIcon = [
    { render: () => <FiBellOff /> },
    { render: () => <FiCloudLightning /> },
    { render: () => <FiFeather /> },
    { render: () => <FiFramer /> },
    { render: () => <FiPenTool /> },
    { render: () => <FiHeadphones /> },
    { render: () => <FiSpeaker /> },
    { render: () => <FiUmbrella /> },
    { render: () => <FiZap /> },
]

const Feather = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`feather-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default Feather
