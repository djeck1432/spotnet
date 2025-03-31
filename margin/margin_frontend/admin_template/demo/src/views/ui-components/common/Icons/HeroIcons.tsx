import IconWrapper from './IconWrapper'
import {
    HiOutlineAtSymbol,
    HiOutlineSparkles,
    HiOutlineShieldCheck,
    HiOutlineTranslate,
    HiOutlineExclamation,
    HiOutlineGlobe,
    HiOutlineLibrary,
    HiOutlineLightBulb,
    HiOutlineTrash,
} from 'react-icons/hi'

const renderIcon = [
    { render: () => <HiOutlineAtSymbol /> },
    { render: () => <HiOutlineSparkles /> },
    { render: () => <HiOutlineShieldCheck /> },
    { render: () => <HiOutlineTranslate /> },
    { render: () => <HiOutlineExclamation /> },
    { render: () => <HiOutlineGlobe /> },
    { render: () => <HiOutlineLibrary /> },
    { render: () => <HiOutlineLightBulb /> },
    { render: () => <HiOutlineTrash /> },
]

const HeroIcons = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`heroIcons-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default HeroIcons
