import {
    ComposableMap,
    Geographies,
    Geography,
    Graticule,
} from 'react-simple-maps'

const geoUrl = '/data/features.json'

const GraticuleMap = () => {
    return (
        <ComposableMap projectionConfig={{ scale: 80 }} height={200}>
            <Graticule stroke="#F53" />
            <Geographies geography={geoUrl}>
                {({ geographies }) =>
                    geographies.map((geo) => (
                        <Geography
                            key={geo.rsmKey}
                            fill="#9998A3"
                            stroke="#EAEAEC"
                            geography={geo}
                        />
                    ))
                }
            </Geographies>
        </ComposableMap>
    )
}

export default GraticuleMap
