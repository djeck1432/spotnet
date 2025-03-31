```jsx
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'

const Footer = () => {
    const [isOpen, setIsOpen] = useState(false)

    const openDrawer = () => {
        setIsOpen(true)
    }

    const onDrawerClose = () => {
        setIsOpen(false)
    }

    const Footer = (
        <div className="text-right w-full">
            <Button size="sm" className="mr-2" onClick={() => onDrawerClose()}>
                Cancel
            </Button>
            <Button size="sm" variant="solid" onClick={() => onDrawerClose()}>
                Confirm
            </Button>
        </div>
    )

    return (
        <div>
            <Button variant="solid" onClick={() => openDrawer()}>
                Open Drawer
            </Button>
            <Drawer
                title="Drawer Title"
                isOpen={isOpen}
                footer={Footer}
                onClose={onDrawerClose}
                onRequestClose={onDrawerClose}
            >
                Drawer Content
            </Drawer>
        </div>
    )
}

export default Footer
```
