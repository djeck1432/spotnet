import Dropdown from '@/components/ui/Dropdown'

const Trigger = () => {
    return (
        <div className="flex">
            <Dropdown title="Click" className="mr-2">
                <Dropdown.Item eventKey="a">Active Item</Dropdown.Item>
                <Dropdown.Item eventKey="b">Item B</Dropdown.Item>
                <Dropdown.Item eventKey="c">Item C</Dropdown.Item>
                <Dropdown.Item eventKey="d">Item D</Dropdown.Item>
            </Dropdown>
            <Dropdown title="Hover" trigger="hover" className="mr-2">
                <Dropdown.Item eventKey="a">Active Item</Dropdown.Item>
                <Dropdown.Item eventKey="b">Item B</Dropdown.Item>
                <Dropdown.Item eventKey="c">Item C</Dropdown.Item>
                <Dropdown.Item eventKey="d">Item D</Dropdown.Item>
            </Dropdown>
            <Dropdown title="Right Click" trigger="context" className="mr-2">
                <Dropdown.Item eventKey="a">Active Item</Dropdown.Item>
                <Dropdown.Item eventKey="b">Item B</Dropdown.Item>
                <Dropdown.Item eventKey="c">Item C</Dropdown.Item>
                <Dropdown.Item eventKey="d">Item D</Dropdown.Item>
            </Dropdown>
        </div>
    )
}

export default Trigger
