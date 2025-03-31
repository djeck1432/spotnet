import { useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import type { Dispatch, SetStateAction } from 'react'

const geoUrl = '/data/features.json'

const MapChart = ({
    setTooltipContent,
}: {
    setTooltipContent: Dispatch<SetStateAction<string>>
}) => {
    return (
        <ComposableMap
            data-tip=""
            height={200}
            projectionConfig={{ scale: 80 }}
        >
            <Geographies geography={geoUrl}>
                {({ geographies }) =>
                    geographies.map((geo) => (
                        <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            style={{
                                default: {
                                    fill: '#D6D6DA',
                                    outline: 'none',
                                },
                                hover: {
                                    fill: '#F53',
                                    outline: 'none',
                                },
                                pressed: {
                                    fill: '#E42',
                                    outline: 'none',
                                },
                            }}
                            onMouseEnter={() => {
                                setTooltipContent(`${geo.properties.name}`)
                            }}
                            onMouseLeave={() => {
                                setTooltipContent('')
                            }}
                        />
                    ))
                }
            </Geographies>
        </ComposableMap>
    )
}

function Map() {
    const [content, setContent] = useState('')
    return (
        <div>
            <MapChart setTooltipContent={setContent} />
            <ReactTooltip>{content}</ReactTooltip>
        </div>
    )
}

function MapChartWithTooltip() {
    return <Map />
}

export default MapChartWithTooltip
