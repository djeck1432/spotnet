import Dropdown from '@/components/ui/Dropdown'

const DropdownItems = () => (
    <>
        <Dropdown.Item eventKey="a">Item A</Dropdown.Item>
        <Dropdown.Item eventKey="b">Item B</Dropdown.Item>
        <Dropdown.Item eventKey="c">Item C</Dropdown.Item>
        <Dropdown.Item eventKey="d">Item D</Dropdown.Item>
    </>
)

const Placement = () => {
    return (
        <div className="grid grid-cols-3 gap-4 max-w-xl">
            <div>
                <Dropdown placement="top-start" title="Top left">
                    <DropdownItems />
                </Dropdown>
            </div>
            <div>
                <Dropdown placement="top-center" title="Top center">
                    <DropdownItems />
                </Dropdown>
            </div>
            <div>
                <Dropdown placement="top-end" title="Top right">
                    <DropdownItems />
                </Dropdown>
            </div>
            <div>
                <Dropdown placement="bottom-start" title="Bottom left">
                    <DropdownItems />
                </Dropdown>
            </div>
            <div>
                <Dropdown placement="bottom-center" title="Bottom center">
                    <DropdownItems />
                </Dropdown>
            </div>
            <div>
                <Dropdown placement="bottom-end" title="Bottom right">
                    <DropdownItems />
                </Dropdown>
            </div>
            <div>
                <Dropdown placement="middle-start-top" title="Middle start top">
                    <DropdownItems />
                </Dropdown>
            </div>
            <div>
                <Dropdown
                    placement="middle-start-bottom"
                    title="Middle start bottom"
                >
                    <DropdownItems />
                </Dropdown>
            </div>
            <div>
                <Dropdown placement="middle-end-top" title="Middle end top">
                    <DropdownItems />
                </Dropdown>
            </div>
            <div>
                <Dropdown
                    placement="middle-end-bottom"
                    title="Middle end bottom"
                >
                    <DropdownItems />
                </Dropdown>
            </div>
        </div>
    )
}

export default Placement
