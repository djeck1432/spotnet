import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import BasicAnnotation from './BasicAnnotation'
import BasicMarker from './BasicMarker'
import BasicWorldMap from './BasicWorldMap'
import CustomMarker from './CustomMarker'
import EuropeMapWithGraticule from './EuropeMapWithGraticule'
import Graticule from './Graticule'
import MapChartWithTexture from './MapChartWithTexture'
import MapChartWithTooltip from './MapChartWithTooltip'
import ChoroplethQuantile from './ChoroplethQuantile'
import ChoroplethQuantize from './ChoroplethQuantize'
import UsaStatesMapWithLabels from './UsaStatesMapWithLabels'
import ChoroplethMap from './ChoroplethMap'

const mdPath = 'Maps'

const demoHeader = {
    title: 'Maps',
    desc: 'A wrapper component for every mapchart built with react-simple-maps. It determines the map context, which is passed to all react-simple-maps components. The context contains information about the projection and path generator, as well as the dimensions of the mapchart.',
}

const demos = [
    {
        mdName: 'BasicAnnotation',
        mdPath: mdPath,
        title: 'Basic Annotation',
        desc: ``,
        component: <BasicAnnotation />,
    },
    {
        mdName: 'BasicMarker',
        mdPath: mdPath,
        title: 'Basic Marker',
        desc: ``,
        component: <BasicMarker />,
    },
    {
        mdName: 'BasicWorldMap',
        mdPath: mdPath,
        title: 'Basic World Map',
        desc: ``,
        component: <BasicWorldMap />,
    },
    {
        mdName: 'CustomMarker',
        mdPath: mdPath,
        title: 'Custom Marker',
        desc: ``,
        component: <CustomMarker />,
    },
    {
        mdName: 'EuropeMapWithGraticule',
        mdPath: mdPath,
        title: 'Europe Map With Graticule',
        desc: ``,
        component: <EuropeMapWithGraticule />,
    },
    {
        mdName: 'Graticule',
        mdPath: mdPath,
        title: 'Graticule',
        desc: ``,
        component: <Graticule />,
    },
    {
        mdName: 'MapChartWithTexture',
        mdPath: mdPath,
        title: 'Map Chart With Texture',
        desc: ``,
        component: <MapChartWithTexture />,
    },
    {
        mdName: 'MapChartWithTooltip',
        mdPath: mdPath,
        title: 'Map Chart With Tooltip',
        desc: ``,
        component: <MapChartWithTooltip />,
    },
    {
        mdName: 'ChoroplethQuantile',
        mdPath: mdPath,
        title: 'Choropleth map chart of the US (quantile)',
        desc: ``,
        component: <ChoroplethQuantile />,
    },
    {
        mdName: 'ChoroplethQuantize',
        mdPath: mdPath,
        title: 'Choropleth map chart of the US (quantize)',
        desc: ``,
        component: <ChoroplethQuantize />,
    },
    {
        mdName: 'UsaStatesMapWithLabels',
        mdPath: mdPath,
        title: 'USA states map with labels',
        desc: ``,
        component: <UsaStatesMapWithLabels />,
    },
    {
        mdName: 'ChoroplethMap',
        mdPath: mdPath,
        title: 'Choropleth Map',
        desc: ``,
        component: <ChoroplethMap />,
    },
]

const demoApi = [
    {
        component: 'ComposableMap',
        api: [
            {
                propName: 'width',
                type: `<code>number</code>`,
                default: `<code>800</code>`,
                desc: '-',
            },
            {
                propName: 'height',
                type: `<code>number</code>`,
                default: `<code>600</code>`,
                desc: '-',
            },
            {
                propName: 'projection',
                type: `<code>string</code> | <code>() => void</code>`,
                default: `<code>'geoEqualEarth'</code>`,
                desc: '-',
            },
            {
                propName: 'projectionConfig',
                type: `<code>object</code>`,
                default: `<code>{}</code>`,
                desc: '-',
            },
        ],
    },
    {
        component: 'ZoomableGroup',
        api: [
            {
                propName: 'center',
                type: `<code>array</code>`,
                default: `<code>[0, 0]</code>`,
                desc: '-',
            },
            {
                propName: 'zoom',
                type: `<code>number</code>`,
                default: `<code>1</code>`,
                desc: '-',
            },
            {
                propName: 'minZoom',
                type: `<code>number</code>`,
                default: `<code>1</code>`,
                desc: '-',
            },
            {
                propName: 'maxZoom',
                type: `<code>number</code>`,
                default: `<code>8</code>`,
                desc: '-',
            },
            {
                propName: 'translateExtent',
                type: `<code>array</code>`,
                default: `<code>[-∞, -∞, ∞, ∞]</code>`,
                desc: '-',
            },
            {
                propName: 'onMoveStart',
                type: `<code>(position: { coordinates: [number, number], zoom: number }, event: D3ZoomEvent< SVGElement, any>) => void</code>`,
                default: `-`,
                desc: '-',
            },
            {
                propName: 'onMove',
                type: `<code>(position: {x: number, y: number, k: number, dragging: WheelEvent }, event: D3ZoomEvent< SVGElement, any>) => void</code>`,
                default: `-`,
                desc: '-',
            },
            {
                propName: 'onMoveEnd',
                type: `<code>(position: { coordinates: [number, number], zoom: number }, event: D3ZoomEvent< SVGElement, any>) => void</code>`,
                default: `-`,
                desc: '-',
            },
        ],
    },
    {
        component: 'Sphere',
        api: [
            {
                propName: 'id',
                type: `<code>string</code>`,
                default: `<code>'rsm-sphere'</code>`,
                desc: '-',
            },
            {
                propName: 'fill',
                type: `<code>string</code>`,
                default: `<code>'transparent'</code>`,
                desc: '-',
            },
            {
                propName: 'stroke',
                type: `<code>string</code>`,
                default: `<code>'currentcolor'</code>`,
                desc: '-',
            },
            {
                propName: 'strokeWidth',
                type: `<code>number</code>`,
                default: `<code>0.5</code>`,
                desc: '-',
            },
        ],
    },
    {
        component: 'Graticule',
        api: [
            {
                propName: 'fill',
                type: `<code>string</code>`,
                default: `<code>'transparent'</code>`,
                desc: '-',
            },
            {
                propName: 'stroke',
                type: `<code>string</code>`,
                default: `<code>'currentcolor'</code>`,
                desc: '-',
            },
            {
                propName: 'step',
                type: `<code>Array</code>`,
                default: `<code>[10, 10]</code>`,
                desc: '-',
            },
        ],
    },
    {
        component: 'Geographies',
        api: [
            {
                propName: 'geography',
                type: `<code>string</code>`,
                default: `-`,
                desc: '-',
            },
            {
                propName: 'children',
                type: `<code>(data: object) => void</code>`,
                default: `-`,
                desc: '-',
            },
            {
                propName: 'parseGeographies',
                type: `<code> (features: Array) => Array</code>`,
                default: `-`,
                desc: '-',
            },
        ],
    },
    {
        component: 'Geography',
        api: [
            {
                propName: 'geography',
                type: `<code>object</code>`,
                default: `-`,
                desc: '-',
            },
            {
                propName: 'style',
                type: `<code>object</code>`,
                default: `-`,
                desc: '-',
            },
        ],
    },
    {
        component: 'Marker',
        api: [
            {
                propName: 'coordinates',
                type: `<code>array</code>`,
                default: `<code>[]</code>`,
                desc: '-',
            },
            {
                propName: 'style',
                type: `<code>object</code>`,
                default: `<code>{}</code>`,
                desc: '-',
            },
        ],
    },
    {
        component: 'Line',
        api: [
            {
                propName: 'from',
                type: `<code>[number, number]</code>`,
                default: `<code>[0, 0]</code>`,
                desc: '-',
            },
            {
                propName: 'to',
                type: `<code>[number, number]</code>`,
                default: `<code>[0, 0]</code>`,
                desc: '-',
            },
            {
                propName: 'coordinates',
                type: `<code>array</code>`,
                default: `<code>[]</code>`,
                desc: '-',
            },
            {
                propName: 'fill',
                type: `<code>string</code>`,
                default: `<code>'transparent'</code>`,
                desc: '-',
            },
            {
                propName: 'stroke',
                type: `<code>string</code>`,
                default: `<code>'currentcolor'</code>`,
                desc: '-',
            },
            {
                propName: 'strokeWidth',
                type: `<code>number</code>`,
                default: `<code>3</code>`,
                desc: '-',
            },
        ],
    },
    {
        component: 'Annotation',
        api: [
            {
                propName: 'subject',
                type: `<code>array</code>`,
                default: `<code>[]</code>`,
                desc: '-',
            },
            {
                propName: 'dx',
                type: `<code>number</code>`,
                default: `<code>30</code>`,
                desc: '-',
            },
            {
                propName: 'dy',
                type: `<code>number</code>`,
                default: `<code>30</code>`,
                desc: '-',
            },
            {
                propName: 'curve',
                type: `<code>number</code>`,
                default: `<code>0</code>`,
                desc: '-',
            },
            {
                propName: 'connectorProps',
                type: `<code>object</code>`,
                default: `-`,
                desc: '-',
            },
        ],
    },
]

const Extra = () => {
    return (
        <>
            <h4 className="mb-4">More usage & examples?</h4>
            <p>
                Read the{' '}
                <a
                    target="_blank"
                    href="https://www.react-simple-maps.io/docs/getting-started/"
                    rel="noreferrer"
                >
                    docs
                </a>
                , or check out the{' '}
                <a
                    target="_blank"
                    href="https://www.react-simple-maps.io/examples/"
                    rel="noreferrer"
                >
                    examples
                </a>
                .
            </p>
        </>
    )
}

const Maps = () => {
    return (
        <DemoLayout
            header={demoHeader}
            demos={demos}
            api={demoApi}
            extra={<Extra />}
        />
    )
}

export default Maps
