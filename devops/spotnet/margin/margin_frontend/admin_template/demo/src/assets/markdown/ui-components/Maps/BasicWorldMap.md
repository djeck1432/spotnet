```jsx
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const geoUrl = '/data/features.json'

const BasicWorldMap = () => {
    return (
        <ComposableMap
            height={200}
            projectionConfig={{
                scale: 100,
            }}
        >
            <Geographies geography={geoUrl}>
                {({ geographies }) =>
                    geographies.map((geo) => (
                        <Geography
                            key={geo.rsmKey}
                            fill="#EAEAEC"
                            stroke="#D6D6DA"
                            geography={geo}
                        />
                    ))
                }
            </Geographies>
        </ComposableMap>
    )
}

export default BasicWorldMap
```
