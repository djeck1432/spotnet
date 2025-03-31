import { useState } from 'react'
import Segment from '@/components/ui/Segment'

type SizeType = 'lg' | 'md' | 'sm' | 'xs'

const Size = () => {
    const [size, setSize] = useState<SizeType[]>(['md'])

    const onSizeChange = (val: SizeType[]) => {
        setSize(val)
    }

    return (
        <Segment
            size={size[0]}
            value={size}
            onChange={(value) => onSizeChange(value as SizeType[])}
        >
            <Segment.Item value="xs">Extra Small</Segment.Item>
            <Segment.Item value="sm">Small</Segment.Item>
            <Segment.Item value="md">Medium</Segment.Item>
            <Segment.Item value="lg">Large</Segment.Item>
        </Segment>
    )
}

export default Size
