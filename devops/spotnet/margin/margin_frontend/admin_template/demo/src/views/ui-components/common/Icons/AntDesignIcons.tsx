import IconWrapper from './IconWrapper'
import {
    AiOutlineAntDesign,
    AiOutlineConsoleSql,
    AiOutlineDeploymentUnit,
    AiOutlineFieldString,
    AiOutlineCiCircle,
    AiOutlineLike,
    AiOutlineUser,
    AiOutlineVerified,
    AiOutlineZhihu,
} from 'react-icons/ai'

const renderIcon = [
    { render: () => <AiOutlineAntDesign /> },
    { render: () => <AiOutlineConsoleSql /> },
    { render: () => <AiOutlineDeploymentUnit /> },
    { render: () => <AiOutlineFieldString /> },
    { render: () => <AiOutlineCiCircle /> },
    { render: () => <AiOutlineLike /> },
    { render: () => <AiOutlineUser /> },
    { render: () => <AiOutlineVerified /> },
    { render: () => <AiOutlineZhihu /> },
]

const AntDesignIcons = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`antDesignIcons-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default AntDesignIcons
