import Card from '@/components/ui/Card'
import Container from '@/components/shared/Container'
import ActionLink from '@/components/shared/ActionLink'
import AntDesignIcons from './AntDesignIcons'
import BootstrapIcons from './BootstrapIcons'
import BoxIcons from './BoxIcons'
import DeviIcons from './DeviIcons'
import Feather from './Feather'
import FlatColorIcons from './FlatColorIcons'
import FontAwesome from './FontAwesome'
import GameIcons from './GameIcons'
import GithubOcticonsIcons from './GithubOcticonsIcons'
import GrommetIcons from './GrommetIcons'
import HeroIcons from './HeroIcons'
import IcoMoonFree from './IcoMoonFree'
import Ionicons4 from './Ionicons4'
import Ionicons5 from './Ionicons5'
import MaterialDesignIcons from './MaterialDesignIcons'
import RemixIcons from './RemixIcons'
import SimpleIcons from './SimpleIcons'
import TablerIcons from './TablerIcons'
import Typicons from './Typicons'
import VsCodeIcons from './VsCodeIcons'
import WeatherIcons from './WeatherIcons'
import CssGg from './CssGg'
import type { CommonProps } from '@/@types/common'

interface IconSetWrapperProps extends CommonProps {
    name?: string
    url: string
}

const IconSetWrapper = ({ children, name, url }: IconSetWrapperProps) => {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer">
            <Card
                clickable
                className="hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400"
                footerClass="bg-gray-50 dark:bg-gray-700 py-4"
                footer={<h6 className="text-center">{name}</h6>}
            >
                {children}
            </Card>
        </a>
    )
}

const iconSets = [
    {
        name: 'Ant Design Icons',
        url: 'https://react-icons.github.io/react-icons/icons/ai',
        render: () => <AntDesignIcons />,
    },
    {
        name: 'Bootstrap Icons',
        url: 'https://react-icons.github.io/react-icons/icons/bs',
        render: () => <BootstrapIcons />,
    },
    {
        name: 'BoxIcons',
        url: 'https://react-icons.github.io/react-icons/icons/bi',
        render: () => <BoxIcons />,
    },
    {
        name: 'DeviIcons',
        url: 'https://react-icons.github.io/react-icons/icons/di',
        render: () => <DeviIcons />,
    },
    {
        name: 'Feather',
        url: 'https://react-icons.github.io/react-icons/icons/fi',
        render: () => <Feather />,
    },
    {
        name: 'Flat Color Icons',
        url: 'https://react-icons.github.io/react-icons/icons/fc',
        render: () => <FlatColorIcons />,
    },
    {
        name: 'Font Awesome',
        url: 'https://react-icons.github.io/react-icons/icons/fa',
        render: () => <FontAwesome />,
    },
    {
        name: 'Game Icons',
        url: 'https://react-icons.github.io/react-icons/icons/gi',
        render: () => <GameIcons />,
    },
    {
        name: 'Github Octicons icons',
        url: 'https://react-icons.github.io/react-icons/icons/go',
        render: () => <GithubOcticonsIcons />,
    },
    {
        name: 'Grommet-Icons',
        url: 'https://react-icons.github.io/react-icons/icons/gr',
        render: () => <GrommetIcons />,
    },
    {
        name: 'Heroicons',
        url: 'https://react-icons.github.io/react-icons/icons/hi',
        render: () => <HeroIcons />,
    },
    {
        name: 'IcoMoon Free',
        url: 'https://react-icons.github.io/react-icons/icons/im',
        render: () => <IcoMoonFree />,
    },
    {
        name: 'Ionicons 4',
        url: 'https://react-icons.github.io/react-icons/icons/io',
        render: () => <Ionicons4 />,
    },
    {
        name: 'Ionicons 5',
        url: 'https://react-icons.github.io/react-icons/icons/io5',
        render: () => <Ionicons5 />,
    },
    {
        name: 'Material Design Icons',
        url: 'https://react-icons.github.io/react-icons/icons/md',
        render: () => <MaterialDesignIcons />,
    },
    {
        name: 'Remix Icons',
        url: 'https://react-icons.github.io/react-icons/icons/ri',
        render: () => <RemixIcons />,
    },
    {
        name: 'Simple Icons',
        url: 'https://react-icons.github.io/react-icons/icons/si',
        render: () => <SimpleIcons />,
    },
    {
        name: 'Tabler Icons',
        url: 'https://react-icons.github.io/react-icons/icons/tb',
        render: () => <TablerIcons />,
    },
    {
        name: 'Typicons',
        url: 'https://react-icons.github.io/react-icons/icons/ti',
        render: () => <Typicons />,
    },
    {
        name: 'VsCodeIcons',
        url: 'https://react-icons.github.io/react-icons/icons/vsc',
        render: () => <VsCodeIcons />,
    },
    {
        name: 'Weather Icons',
        url: 'https://react-icons.github.io/react-icons/icons/wi',
        render: () => <WeatherIcons />,
    },
    {
        name: 'css.gg',
        url: 'https://react-icons.github.io/react-icons/icons/cg',
        render: () => <CssGg />,
    },
]

const Icons = () => {
    return (
        <Container>
            <div className="text-center mb-8">
                <h2 className="mb-2">React Icons</h2>
                <p className="max-w-xl mx-auto">
                    <ActionLink
                        href="https://react-icons.github.io/react-icons"
                        target="_blank"
                    >
                        react-icons
                    </ActionLink>
                    {` `}includes many popular icons set which utilizes ES6
                    imports that allows you to include only the icons is using.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1200px] mx-auto">
                {iconSets.map(({ name, render, url }) => (
                    <IconSetWrapper key={name} name={name} url={url}>
                        {render()}
                    </IconSetWrapper>
                ))}
            </div>
        </Container>
    )
}

export default Icons
