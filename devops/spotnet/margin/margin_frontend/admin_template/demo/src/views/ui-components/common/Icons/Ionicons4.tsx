import IconWrapper from './IconWrapper'
import {
    IoLogoIonic,
    IoMdCodeWorking,
    IoMdCloudOutline,
    IoMdBicycle,
    IoIosTransgender,
    IoIosThermometer,
    IoIosTimer,
    IoIosMusicalNotes,
    IoIosHeartHalf,
} from 'react-icons/io'

const renderIcon = [
    { render: () => <IoLogoIonic /> },
    { render: () => <IoMdCodeWorking /> },
    { render: () => <IoMdCloudOutline /> },
    { render: () => <IoMdBicycle /> },
    { render: () => <IoIosTransgender /> },
    { render: () => <IoIosThermometer /> },
    { render: () => <IoIosTimer /> },
    { render: () => <IoIosMusicalNotes /> },
    { render: () => <IoIosHeartHalf /> },
]

const Ionicons4 = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`ionicons4-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default Ionicons4
