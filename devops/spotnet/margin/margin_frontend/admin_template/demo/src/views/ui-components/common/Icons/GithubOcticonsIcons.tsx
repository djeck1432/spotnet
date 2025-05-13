import IconWrapper from './IconWrapper'
import {
    GoFileMedia,
    GoFlame,
    GoAlert,
    GoGitCompare,
    GoGitCommit,
    GoGitPullRequest,
    GoCode,
    GoIssueReopened,
    GoTerminal,
} from 'react-icons/go'

const renderIcon = [
    { render: () => <GoFileMedia /> },
    { render: () => <GoFlame /> },
    { render: () => <GoAlert /> },
    { render: () => <GoGitCompare /> },
    { render: () => <GoGitCommit /> },
    { render: () => <GoGitPullRequest /> },
    { render: () => <GoCode /> },
    { render: () => <GoIssueReopened /> },
    { render: () => <GoTerminal /> },
]

const GithubOcticonsIcons = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`githubOcticonsIcons-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default GithubOcticonsIcons
