import IconWrapper from './IconWrapper'
import {
    FaFontAwesomeAlt,
    FaRegCalendarTimes,
    FaRegCommentDots,
    FaRegHandRock,
    FaRegGrinSquintTears,
    FaRegRegistered,
    FaRegLemon,
    FaYinYang,
    FaWind,
} from 'react-icons/fa'

const renderIcon = [
    { render: () => <FaFontAwesomeAlt /> },
    { render: () => <FaRegCalendarTimes /> },
    { render: () => <FaRegCommentDots /> },
    { render: () => <FaRegHandRock /> },
    { render: () => <FaRegGrinSquintTears /> },
    { render: () => <FaRegRegistered /> },
    { render: () => <FaRegLemon /> },
    { render: () => <FaYinYang /> },
    { render: () => <FaWind /> },
]

const FontAwesome = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`fontAwesome-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default FontAwesome
