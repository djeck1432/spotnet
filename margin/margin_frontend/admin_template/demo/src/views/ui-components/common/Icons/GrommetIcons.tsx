import IconWrapper from './IconWrapper'
import {
    GrAttraction,
    GrCut,
    GrDocumentCsv,
    GrCubes,
    GrDetach,
    GrSans,
    GrTextWrap,
    GrTrophy,
    GrUserSettings,
} from 'react-icons/gr'

const renderIcon = [
    { render: () => <GrAttraction /> },
    { render: () => <GrCut /> },
    { render: () => <GrDocumentCsv /> },
    { render: () => <GrCubes /> },
    { render: () => <GrDetach /> },
    { render: () => <GrSans /> },
    { render: () => <GrTextWrap /> },
    { render: () => <GrTrophy /> },
    { render: () => <GrUserSettings /> },
]

const GrommetIcons = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`grommetIcons-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default GrommetIcons
