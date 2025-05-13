import IconWrapper from './IconWrapper'
import {
    RiMailDownloadLine,
    RiChatForwardLine,
    RiRemixiconLine,
    RiSwitchLine,
    RiRocket2Line,
    RiDvLine,
    RiRadio2Line,
    RiLeafLine,
    RiSwordLine,
} from 'react-icons/ri'

const renderIcon = [
    { render: () => <RiMailDownloadLine /> },
    { render: () => <RiChatForwardLine /> },
    { render: () => <RiRemixiconLine /> },
    { render: () => <RiSwitchLine /> },
    { render: () => <RiRocket2Line /> },
    { render: () => <RiDvLine /> },
    { render: () => <RiRadio2Line /> },
    { render: () => <RiLeafLine /> },
    { render: () => <RiSwordLine /> },
]

const RemixIcons = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`remixIcons-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default RemixIcons
