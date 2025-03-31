import Menu from '@/components/ui/Menu'

const MenuGroup = () => {
    return (
        <div className="border rounded-md p-2" style={{ maxWidth: 250 }}>
            <Menu>
                <Menu.MenuGroup key="group-1" label="Group 1">
                    <Menu.MenuItem eventKey="group-1-item-1">
                        Item 1
                    </Menu.MenuItem>
                    <Menu.MenuItem eventKey="group-1-item-2">
                        Item 2
                    </Menu.MenuItem>
                    <Menu.MenuCollapse eventKey="group-1-item-3" label="Item 3">
                        <Menu.MenuItem eventKey="group-1-item-3-1">
                            Item 3.1
                        </Menu.MenuItem>
                        <Menu.MenuItem eventKey="group-1-item-3-2">
                            Item 3.2
                        </Menu.MenuItem>
                    </Menu.MenuCollapse>
                </Menu.MenuGroup>
                <Menu.MenuGroup key="group-2" label="Group 2">
                    <Menu.MenuItem eventKey="group-2-item-1">
                        Item 1
                    </Menu.MenuItem>
                    <Menu.MenuItem eventKey="group-2-item-2">
                        Item 2
                    </Menu.MenuItem>
                </Menu.MenuGroup>
            </Menu>
        </div>
    )
}

export default MenuGroup
