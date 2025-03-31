import IconWrapper from './IconWrapper'
import {
    TbBrandTabler,
    TbBrandSvelte,
    TbAuth2Fa,
    TbAward,
    TbBatteryCharging2,
    TbBuildingChurch,
    TbChartDonut4,
    TbCloudLock,
    TbEgg,
} from 'react-icons/tb'

const renderIcon = [
    { render: () => <TbBrandTabler /> },
    { render: () => <TbBrandSvelte /> },
    { render: () => <TbAuth2Fa /> },
    { render: () => <TbAward /> },
    { render: () => <TbBatteryCharging2 /> },
    { render: () => <TbBuildingChurch /> },
    { render: () => <TbChartDonut4 /> },
    { render: () => <TbCloudLock /> },
    { render: () => <TbEgg /> },
]

const TablerIcons = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`tablerIcons-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default TablerIcons
