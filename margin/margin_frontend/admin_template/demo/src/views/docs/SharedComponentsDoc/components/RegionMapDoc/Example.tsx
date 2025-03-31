import RegionMap from '@/components/shared/RegionMap'
import { theme } from 'twin.macro'

const twColor: Record<string, string> = theme`colors`

const mapColors = [
    twColor.indigo['600'],
    twColor.blue['500'],
    twColor.green['500'],
    twColor.yellow['500'],
    twColor.pink['500'],
    twColor.purple['500'],
]

const getMapColors = (
    data: {
        name: string
        value?: string | number
        color?: string
    }[] = [],
) => {
    return data.map((item, index) => ({
        ...item,
        color: mapColors[index],
    }))
}

const Example = () => {
    const data = [
        {
            name: 'United States of America',
            value: 37.61,
        },
        {
            name: 'Brazil',
            value: 16.79,
        },
        {
            name: 'India',
            value: 12.42,
        },
        {
            name: 'China',
            value: 9.85,
        },
        {
            name: 'Algeria',
            value: 7.68,
        },
        {
            name: 'Indonesia',
            value: 5.11,
        },
    ]

    return <RegionMap data={getMapColors(data)} valueSuffix="%" />
}

export default Example
