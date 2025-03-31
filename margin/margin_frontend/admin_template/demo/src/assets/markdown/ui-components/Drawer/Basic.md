```jsx
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import type { MouseEvent } from 'react'

const Basic = () => {
    const [isOpen, setIsOpen] = useState(false)

    const openDrawer = () => {
        setIsOpen(true)
    }

    const onDrawerClose = (e: MouseEvent) => {
        console.log('onDrawerClose', e)
        setIsOpen(false)
    }

    return (
        <div>
            <Button onClick={() => openDrawer()}>Open Drawer</Button>
            <Drawer
                title="Drawer Title"
                isOpen={isOpen}
                onClose={onDrawerClose}
                onRequestClose={onDrawerClose}
            >
                Drawer Content
            </Drawer>
        </div>
    )
}

export default Basic
```
