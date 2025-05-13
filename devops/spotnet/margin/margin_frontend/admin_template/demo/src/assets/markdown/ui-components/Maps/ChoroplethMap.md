```jsx
import { useEffect, useState } from 'react'
import { csv } from 'd3-fetch'
import { scaleLinear } from 'd3-scale'
import {
    ComposableMap,
    Geographies,
    Geography,
    Sphere,
    Graticule,
} from 'react-simple-maps'
import type { DSVRowArray } from 'd3-dsv'

const geoUrl = '/data/features.json'

const colorScale = scaleLinear<string>()
    .domain([0.29, 0.68])
    .range(['#ffedea', '#ff5233'])

const ChoroplethMap = () => {
    const [data, setData] = useState<DSVRowArray<string>>()

    useEffect(() => {
        csv('/data/vulnerability.csv').then((data) => {
            setData(data)
        })
    }, [])

    return (
        <ComposableMap
            height={200}
            projectionConfig={{
                rotate: [-10, 0, 0],
                scale: 80,
            }}
        >
            <Sphere id="rsm-sphere" stroke="#E4E5E6" strokeWidth={0.5} fill="currentcolor" />
            <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
            {data && data.length > 0 && (
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            const d = data.find(
                                (s) => s.ISO3 === geo.properties.ISO_A3
                            )
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={d ? colorScale(Number(d['2017'])) : '#F5F4F6'}
                                />
                            )
                        })
                    }
                </Geographies>
            )}
        </ComposableMap>
    )
}

export default ChoroplethMap
```
