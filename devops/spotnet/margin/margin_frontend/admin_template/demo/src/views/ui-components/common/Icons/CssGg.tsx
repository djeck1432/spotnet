import IconWrapper from './IconWrapper'
import {
    CgEreader,
    CgClapperBoard,
    CgFormatHeading,
    CgIcecream,
    CgMoon,
    CgQuoteO,
    CgSupport,
    CgVoicemailO,
    CgPacman,
} from 'react-icons/cg'

const renderIcon = [
    { render: () => <CgEreader /> },
    { render: () => <CgClapperBoard /> },
    { render: () => <CgFormatHeading /> },
    { render: () => <CgIcecream /> },
    { render: () => <CgMoon /> },
    { render: () => <CgQuoteO /> },
    { render: () => <CgSupport /> },
    { render: () => <CgVoicemailO /> },
    { render: () => <CgPacman /> },
]

const CssGg = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`cssGg-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default CssGg
