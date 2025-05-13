import Dropdown from '@/components/ui/Dropdown'

const DefaultActive = () => {
    return (
        <div>
            <Dropdown title="Click Me!" activeKey="a">
                <Dropdown.Item eventKey="a">Item A</Dropdown.Item>
                <Dropdown.Item eventKey="b">Item B</Dropdown.Item>
                <Dropdown.Item eventKey="c">Item C</Dropdown.Item>
                <Dropdown.Item eventKey="d">Item D</Dropdown.Item>
            </Dropdown>
            <Dropdown title="Click Me!" activeKey="item-2-1-2">
                <Dropdown.Item eventKey="item-1">Item 1</Dropdown.Item>
                <Dropdown.Menu eventKey="item-2" title="Item 2">
                    <Dropdown.Menu eventKey="item-2-1" title="Item 2-1">
                        <Dropdown.Item eventKey="item-2-1-1">
                            Item 2-1-1
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="item-2-1-2">
                            Item 2-1-2
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="item-2-1-3">
                            Item 2-1-3
                        </Dropdown.Item>
                    </Dropdown.Menu>
                    <Dropdown.Item eventKey="item-2-2">Item 2-2</Dropdown.Item>
                    <Dropdown.Item eventKey="item-2-3">Item 2-3</Dropdown.Item>
                </Dropdown.Menu>
                <Dropdown.Item>Item 3</Dropdown.Item>
            </Dropdown>
        </div>
    )
}

export default DefaultActive
