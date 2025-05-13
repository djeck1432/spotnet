import Segment from '@/components/ui/Segment'

const MultipleSelection = () => {
    return (
        <Segment selectionType="multiple">
            <Segment.Item value="left">Left</Segment.Item>
            <Segment.Item value="center">Center</Segment.Item>
            <Segment.Item value="right">Right</Segment.Item>
        </Segment>
    )
}

export default MultipleSelection
