```jsx
import { useState, useCallback } from 'react'
import Segment from '@/components/ui/Segment'

const Controlled = () => {
    const [singleSegmentValue, setSingleSegmentValue] = useState(['left'])
    const [multipleSegmentValue, setMultipleSegmentValue] = useState(['center'])

    const onSingleSelectionSegmentChange = useCallback(
        (val: string[]) => {
            setSingleSegmentValue(val)
        },
        [setSingleSegmentValue]
    )

    const onMultipleSegmentValueChange = useCallback(
        (val: string[]) => {
            setMultipleSegmentValue(val)
        },
        [setMultipleSegmentValue]
    )

    return (
        <>
            <div className="mb-6">
                <h6 className="mb-3">Single Selection</h6>
                <Segment
                    value={singleSegmentValue}
                    onChange={(val) => onSingleSelectionSegmentChange(val as string[])}
                >
                    <Segment.Item value="left">Left</Segment.Item>
                    <Segment.Item value="center">Center</Segment.Item>
                    <Segment.Item value="right">Right</Segment.Item>
                </Segment>
            </div>
            <div>
                <h6 className="mb-3">Multiple Selection</h6>
                <Segment
                    selectionType="multiple"
                    value={multipleSegmentValue}
                    onChange={(val) => onMultipleSegmentValueChange(val as string[])}
                >
                    <Segment.Item value="left">Left</Segment.Item>
                    <Segment.Item value="center">Center</Segment.Item>
                    <Segment.Item value="right">Right</Segment.Item>
                </Segment>
            </div>
        </>
    )
}

export default Controlled
```
