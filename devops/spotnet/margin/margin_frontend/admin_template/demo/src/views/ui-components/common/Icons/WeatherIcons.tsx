import IconWrapper from './IconWrapper'
import {
    WiCloudyGusts,
    WiCloudyWindy,
    WiCloudy,
    WiDayCloudyGusts,
    WiDayLightning,
    WiDaySunnyOvercast,
    WiNightRainMix,
    WiSunset,
    WiTornado,
} from 'react-icons/wi'

const renderIcon = [
    { render: () => <WiCloudyGusts /> },
    { render: () => <WiCloudyWindy /> },
    { render: () => <WiCloudy /> },
    { render: () => <WiDayCloudyGusts /> },
    { render: () => <WiDayLightning /> },
    { render: () => <WiDaySunnyOvercast /> },
    { render: () => <WiNightRainMix /> },
    { render: () => <WiSunset /> },
    { render: () => <WiTornado /> },
]

const WeatherIcons = () => {
    return (
        <div className="grid grid-cols-3 gap-y-6 text-4xl text-center heading-text">
            {renderIcon.map((icon, index) => (
                <IconWrapper key={`weatherIcons-${index}`}>
                    {icon.render()}
                </IconWrapper>
            ))}
        </div>
    )
}

export default WeatherIcons
