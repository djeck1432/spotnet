import IconWrapper from './IconWrapper'
import {
    BsBootstrap,
    BsBoxSeam,
    BsCalendarDate,
    BsCardText,
    BsCheckCircle,
    BsCloudHaze,
    BsCloudSnow,
    BsPlayBtn,
    BsGraphUp,
} from 'react-icons/bs'

const renderIcon = [
    { render: () => <BsBootstrap /> },
    { render: () => <BsBoxSeam /> },
    { render: () => <BsCalendarDate /> },
    { render: () => <BsCardText /> },
    { render: () => <BsCheckCircle /> },
    { render: () => <BsCloudHaze /> },
    { render: () => <BsCloudSnow /> },
    { render: () => <BsPlayBtn /> },
    { render: () => <BsGraphUp /> },
]

const BootstrapIcons = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`bootstrapIcons-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default BootstrapIcons
