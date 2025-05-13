import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'RegionMapDoc'

const demoHeader = {
    title: 'RegionMap',
    desc: 'A simple geodata component wrap on top of <a class="text-indigo-600 underline" href="https://www.react-simple-maps.io/" target="_blank">react-simple-maps</a>.',
}

const demos = [
    {
        mdName: 'Example',
        mdPath: mdPath,
        title: 'Example',
        desc: `Example usage.`,
        component: <Example />,
    },
]

const demoApi = [
    {
        component: 'RegionMap',
        api: [
            {
                propName: 'data',
                type: `<code>Array<{name: string, value: string | number}></code>`,
                default: `<code>[]</code>`,
                desc: 'Map data',
            },
            {
                propName: 'mapSource',
                type: `<code>string</code> | <code>string[]</code>`,
                default: ``,
                desc: 'Geography SVG, More geography SVG can be found in this <a class="text-indigo-600 underline" href="https://github.com/deldersveld/topojson/tree/master/countries" target="_blank" rel="noopener noreferrer">repository</a>',
            },
            {
                propName: 'valuePrefix',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Render a prefix content before the value',
            },
            {
                propName: 'valueSuffix',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Render a suffix content next to the value',
            },
        ],
    },
]

const RegionMapDoc = () => {
    return (
        <DemoLayout
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            api={demoApi}
            mdPrefixPath="shared"
        />
    )
}

export default RegionMapDoc
