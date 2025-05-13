import IconWrapper from './IconWrapper'
import {
    IoLogoIonic,
    IoMoonOutline,
    IoPawOutline,
    IoPersonAddOutline,
    IoQrCodeOutline,
    IoRestaurantOutline,
    IoSchoolOutline,
    IoSkullOutline,
    IoSunnyOutline,
} from 'react-icons/io5'

const renderIcon = [
    { render: () => <IoLogoIonic /> },
    { render: () => <IoMoonOutline /> },
    { render: () => <IoPawOutline /> },
    { render: () => <IoPersonAddOutline /> },
    { render: () => <IoQrCodeOutline /> },
    { render: () => <IoRestaurantOutline /> },
    { render: () => <IoSchoolOutline /> },
    { render: () => <IoSkullOutline /> },
    { render: () => <IoSunnyOutline /> },
]

const Ionicons5 = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`ionicons5-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default Ionicons5
