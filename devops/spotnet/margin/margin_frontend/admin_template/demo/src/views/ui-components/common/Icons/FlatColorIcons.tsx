import IconWrapper from './IconWrapper'
import {
    FcCamera,
    FcAudioFile,
    FcAssistant,
    FcCommandLine,
    FcDoughnutChart,
    FcHighBattery,
    FcHighPriority,
    FcPositiveDynamic,
    FcUnlock,
} from 'react-icons/fc'

const renderIcon = [
    { render: () => <FcCamera /> },
    { render: () => <FcAudioFile /> },
    { render: () => <FcAssistant /> },
    { render: () => <FcCommandLine /> },
    { render: () => <FcDoughnutChart /> },
    { render: () => <FcHighBattery /> },
    { render: () => <FcHighPriority /> },
    { render: () => <FcPositiveDynamic /> },
    { render: () => <FcUnlock /> },
]

const FlatColorIcons = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`flatColorIcons-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default FlatColorIcons
