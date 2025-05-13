import IconWrapper from './IconWrapper'
import {
    GiArmoredBoomerang,
    GiArrowhead,
    GiAxeSword,
    GiWideArrowDunk,
    GiEagleHead,
    GiDoorRingHandle,
    GiClick,
    GiCheckedShield,
    GiCrossbow,
} from 'react-icons/gi'

const renderIcon = [
    { render: () => <GiArmoredBoomerang /> },
    { render: () => <GiArrowhead /> },
    { render: () => <GiAxeSword /> },
    { render: () => <GiWideArrowDunk /> },
    { render: () => <GiEagleHead /> },
    { render: () => <GiDoorRingHandle /> },
    { render: () => <GiClick /> },
    { render: () => <GiCheckedShield /> },
    { render: () => <GiCrossbow /> },
]

const GameIcons = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`gameIcons-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default GameIcons
