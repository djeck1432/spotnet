import IconWrapper from './IconWrapper'
import {
    DiAngularSimple,
    DiApple,
    DiChrome,
    DiDreamweaver,
    DiGnu,
    DiGoogleAnalytics,
    DiIllustrator,
    DiOpera,
    DiSass,
} from 'react-icons/di'

const renderIcon = [
    { render: () => <DiAngularSimple /> },
    { render: () => <DiApple /> },
    { render: () => <DiChrome /> },
    { render: () => <DiDreamweaver /> },
    { render: () => <DiGnu /> },
    { render: () => <DiGoogleAnalytics /> },
    { render: () => <DiIllustrator /> },
    { render: () => <DiOpera /> },
    { render: () => <DiSass /> },
]

const DeviIcons = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`deviIcons-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default DeviIcons
