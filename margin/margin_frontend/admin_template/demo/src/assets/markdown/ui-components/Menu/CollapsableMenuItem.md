```jsx
import Menu from '@/components/ui/Menu'
import type { MouseEvent } from 'react'

const CollapsableMenuItem = () => {
    const handleToggle = (expanded: boolean, e: MouseEvent) => {
        console.log('expanded', expanded)
        console.log('event', e)
    }

    return (
        <div className="border rounded-md p-2" style={{ maxWidth: 250 }}>
            <Menu>
                <Menu.MenuItem eventKey="item-1">Item 1</Menu.MenuItem>
                <Menu.MenuItem eventKey="item-2">Item 2</Menu.MenuItem>
                <Menu.MenuCollapse
                    eventKey="item-3"
                    label="Item 3"
                    onToggle={handleToggle}
                >
                    <Menu.MenuItem eventKey="item-3-1">Item 3.1</Menu.MenuItem>
                    <Menu.MenuItem eventKey="item-3-2">Item 3.2</Menu.MenuItem>
                </Menu.MenuCollapse>
                <Menu.MenuCollapse
                    eventKey="item-4"
                    label="Item 4"
                    onToggle={handleToggle}
                >
                    <Menu.MenuItem eventKey="item-4-1">Item 4.1</Menu.MenuItem>
                    <Menu.MenuItem eventKey="item-4-2">Item 4.2</Menu.MenuItem>
                    <Menu.MenuCollapse
                        eventKey="item-4-3"
                        label="Item 4.3"
                        onToggle={handleToggle}
                    >
                        <Menu.MenuItem eventKey="item-4-3-1">Item 4.3.1</Menu.MenuItem>
                        <Menu.MenuItem eventKey="item-4-2-1">Item 4.3.2</Menu.MenuItem>
                    </Menu.MenuCollapse>
                </Menu.MenuCollapse>
            </Menu>
        </div>
    )
}

export default CollapsableMenuItem

```
