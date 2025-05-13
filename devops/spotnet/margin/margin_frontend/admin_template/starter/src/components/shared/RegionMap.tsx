import { useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { THEME_ENUM } from '@/constants/theme.constant'
import WorldMap from '@/assets/maps/world-countries-sans-antarctica.json'
import shadeColor from '@/utils/shadeColor'
import { useAppSelector } from '@/store'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { theme } from 'twin.macro'
import type { Dispatch, SetStateAction } from 'react'

type MapDataProp = {
    name: string
    value?: string | number
    color?: string
}[]

type RegionMapProps = {
    data: MapDataProp
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapSource?: string | Record<string, any> | string[]
    valueSuffix?: string
    valuePrefix?: string
}

type MapProps = Omit<RegionMapProps, 'valueSuffix' | 'valuePrefix'> & {
    prefix?: string
    suffix?: string
}

type MapChartProps = MapProps & {
    setTooltipContent: Dispatch<SetStateAction<string>>
}

const twColor: Record<string, string> = theme`colors`

const geoUrl = WorldMap
const hoverPercentage = -10

const { MODE_DARK } = THEME_ENUM

const getHighlightedRegion = (
    name: unknown,
    data: MapDataProp,
    defaultMapColor: string,
) => {
    if (data.length > 0 || name) {
        for (let i = 0; i < data.length; i++) {
            const elm = data[i]
            if (name === elm.name) {
                return elm.color
            }
        }
        return defaultMapColor
    }
    return defaultMapColor
}

const getRegionHoverColor = (
    name: unknown,
    data: MapDataProp,
    defaultMapColor = '',
) => {
    if (data.length > 0 || name) {
        for (let i = 0; i < data.length; i++) {
            const elm = data[i]
            if (name === elm.name) {
                return shadeColor(elm.color || '', hoverPercentage)
            }
        }
        return shadeColor(defaultMapColor, hoverPercentage)
    }
    return shadeColor(defaultMapColor, hoverPercentage)
}

const getRegionValue = (
    name: unknown,
    data: MapDataProp,
    suffix = '',
    prefix = '',
) => {
    if (data.length > 0 || name) {
        for (let i = 0; i < data.length; i++) {
            const elm = data[i]
            if (name === elm.name) {
                return `${elm.name} - ${prefix}${elm.value}${suffix}`
            }
        }
        return ''
    }
    return ''
}

const MapChart = (props: MapChartProps) => {
    const { setTooltipContent, data, mapSource, suffix, prefix } = props

    const mode = useAppSelector((state) => state.theme.mode)

    return (
        <ComposableMap
            style={{ transform: 'translateY(20px)' }}
            data-tip=""
            height={380}
            projectionConfig={{ scale: 145 }}
        >
            <Geographies geography={mapSource}>
                {({ geographies }) =>
                    geographies.map((geo) => {
                        const geoName = geo.properties.name
                        return (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                strokeWidth={2}
                                fill={getHighlightedRegion(
                                    geoName,
                                    data,
                                    mode === MODE_DARK
                                        ? twColor.gray['500']
                                        : twColor.gray['100'],
                                )}
                                stroke={
                                    mode === MODE_DARK
                                        ? twColor.gray['600']
                                        : twColor.gray['300']
                                }
                                style={{
                                    hover: {
                                        fill: getRegionHoverColor(
                                            geoName,
                                            data,
                                            mode === MODE_DARK
                                                ? twColor.gray['500']
                                                : twColor.gray['100'],
                                        ),
                                        outline: 'none',
                                    },
                                }}
                                onMouseEnter={() => {
                                    setTooltipContent(
                                        getRegionValue(
                                            geoName,
                                            data,
                                            suffix,
                                            prefix,
                                        ),
                                    )
                                }}
                                onMouseLeave={() => {
                                    setTooltipContent('')
                                }}
                            />
                        )
                    })
                }
            </Geographies>
        </ComposableMap>
    )
}

const Map = (props: MapProps) => {
    const [content, setContent] = useState('')
    return (
        <>
            <MapChart {...props} setTooltipContent={setContent} />
            <ReactTooltip>{content}</ReactTooltip>
        </>
    )
}

const RegionMap = (props: RegionMapProps) => {
    const { data = [], mapSource = geoUrl, valueSuffix, valuePrefix } = props

    return (
        <Map
            data={data}
            mapSource={mapSource}
            prefix={valuePrefix}
            suffix={valueSuffix}
        />
    )
}

export default RegionMap
