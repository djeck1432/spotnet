import IconWrapper from './IconWrapper'
import {
    BiBox,
    BiChurch,
    BiCookie,
    BiDiamond,
    BiGitMerge,
    BiMapPin,
    BiTimer,
    BiWifi2,
    BiShieldQuarter,
} from 'react-icons/bi'

const renderIcon = [
    { render: () => <BiBox /> },
    { render: () => <BiChurch /> },
    { render: () => <BiCookie /> },
    { render: () => <BiDiamond /> },
    { render: () => <BiGitMerge /> },
    { render: () => <BiMapPin /> },
    { render: () => <BiTimer /> },
    { render: () => <BiWifi2 /> },
    { render: () => <BiShieldQuarter /> },
]

const BoxIcons = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`boxIcons-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default BoxIcons
