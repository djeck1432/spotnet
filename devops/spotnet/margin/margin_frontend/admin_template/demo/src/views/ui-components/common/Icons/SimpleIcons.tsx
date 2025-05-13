import IconWrapper from './IconWrapper'
import {
    SiSimpleicons,
    SiSonarqube,
    SiPyup,
    SiPlatzi,
    SiPagespeedinsights,
    SiMocha,
    SiMoleculer,
    SiMazda,
    SiMcdonalds,
} from 'react-icons/si'

const renderIcon = [
    { render: () => <SiSimpleicons /> },
    { render: () => <SiSonarqube /> },
    { render: () => <SiPyup /> },
    { render: () => <SiPlatzi /> },
    { render: () => <SiPagespeedinsights /> },
    { render: () => <SiMocha /> },
    { render: () => <SiMoleculer /> },
    { render: () => <SiMazda /> },
    { render: () => <SiMcdonalds /> },
]

const SimpleIcons = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`simpleIcons-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default SimpleIcons
