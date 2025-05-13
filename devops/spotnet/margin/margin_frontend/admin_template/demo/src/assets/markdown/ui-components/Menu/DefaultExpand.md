```jsx
import { useState } from 'react'
import Menu from '@/components/ui/Menu'

const DefaultExpand = () => {
    const [defaultExpandKey] = useState(['item-3'])

    return (
        <div className="border rounded-md p-2" style={{ maxWidth: 250 }}>
            <Menu defaultExpandedKeys={defaultExpandKey}>
                <Menu.MenuItem eventKey="item-1">Item 1</Menu.MenuItem>
                <Menu.MenuItem eventKey="item-2">Item 2</Menu.MenuItem>
                <Menu.MenuCollapse eventKey="item-3" label="Item 3">
                    <Menu.MenuItem eventKey="item-3-1">Item 3.1</Menu.MenuItem>
                    <Menu.MenuItem eventKey="item-3-2">Item 3.2</Menu.MenuItem>
                </Menu.MenuCollapse>
                <Menu.MenuCollapse eventKey="item-4" label="Item 4">
                    <Menu.MenuItem eventKey="item-4-1">Item 4.1</Menu.MenuItem>
                    <Menu.MenuItem eventKey="item-4-2">Item 4.2</Menu.MenuItem>
                </Menu.MenuCollapse>
            </Menu>
        </div>
    )
}

export default DefaultExpand
```
