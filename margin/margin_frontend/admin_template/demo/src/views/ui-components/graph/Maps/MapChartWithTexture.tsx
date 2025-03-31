import {
    ComposableMap,
    Geographies,
    Geography,
    Graticule,
    Line,
    Sphere,
} from 'react-simple-maps'
import { PatternLines } from '@visx/pattern'

const geoUrl = '/data/features.json'

// https://www.worldatlas.com/articles/top-coffee-producing-countries.html
const highlighted = [
    'BRA',
    'VNM',
    'COL',
    'IDN',
    'ETH',
    'HND',
    'IND',
    'UGA',
    'MEX',
    'GTM',
    'PER',
    'NIC',
    'CHN',
    'CIV',
    'CRI',
    'KEN',
    'PNG',
    'TZA',
    'SLV',
    'ECU',
    'CMR',
    'LAO',
    'MDG',
    'GAB',
    'THA',
    'VEN',
    'DOM',
    'HTI',
    'COD',
    'RWA',
    'BDI',
    'PHL',
    'TGO',
    'GIN',
    'YEM',
    'CUB',
    'PAN',
    'BOL',
    'TLS',
    'CAF',
    'NGA',
    'GHA',
    'SLE',
    'AGO',
    'JAM',
    'PRY',
    'MWI',
    'TTO',
    'ZWE',
    'LBR',
]

function generateCircle(deg: number): [number, number][] {
    if (!deg)
        return [
            [-180, 0],
            [-90, 0],
            [0, 0],
            [90, 0],
            [180, 0],
        ]
    return new Array(361).fill(1).map((d, i) => {
        return [-180 + i, deg]
    })
}

const MapChartWithTexture = () => {
    return (
        <ComposableMap
            projection="geoEqualEarth"
            height={200}
            projectionConfig={{
                scale: 80,
            }}
        >
            <PatternLines
                id="lines"
                height={6}
                width={6}
                stroke="#776865"
                strokeWidth={1}
                background="#F6F0E9"
                orientation={['diagonal']}
            />
            <Sphere
                id="rsm-sphere-1"
                fill="currentcolor"
                stroke="#DDD"
                strokeWidth={0.5}
            />
            <Graticule stroke="#DDD" />
            <Geographies geography={geoUrl} stroke="#FFF" strokeWidth={0.5}>
                {({ geographies }) =>
                    geographies.map((geo) => {
                        const isHighlighted =
                            highlighted.indexOf(geo.properties.ISO_A3) !== -1
                        return (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill={
                                    isHighlighted ? "url('#lines')" : '#F6F0E9'
                                }
                                onClick={() =>
                                    console.log(geo.properties.ISO_A3)
                                }
                            />
                        )
                    })
                }
            </Geographies>
            <Line
                coordinates={generateCircle(0)}
                stroke="#F53"
                strokeWidth={2}
            />
            <Line
                coordinates={generateCircle(23)}
                stroke="#776865"
                strokeWidth={1}
                strokeDasharray={`[5, 5]`}
            />
            <Line
                coordinates={generateCircle(-24)}
                stroke="#776865"
                strokeWidth={1}
                strokeDasharray={`[5, 5]`}
            />
        </ComposableMap>
    )
}

export default MapChartWithTexture
