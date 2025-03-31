import IconWrapper from './IconWrapper'
import {
    TiArrowUpOutline,
    TiMessages,
    TiThumbsOk,
    TiPlaneOutline,
    TiPlusOutline,
    TiFolderOpen,
    TiCameraOutline,
    TiLightbulb,
    TiSortAlphabetically,
} from 'react-icons/ti'

const renderIcon = [
    { render: () => <TiArrowUpOutline /> },
    { render: () => <TiMessages /> },
    { render: () => <TiThumbsOk /> },
    { render: () => <TiPlaneOutline /> },
    { render: () => <TiPlusOutline /> },
    { render: () => <TiFolderOpen /> },
    { render: () => <TiCameraOutline /> },
    { render: () => <TiLightbulb /> },
    { render: () => <TiSortAlphabetically /> },
]

const Typicons = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`typicons-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default Typicons
