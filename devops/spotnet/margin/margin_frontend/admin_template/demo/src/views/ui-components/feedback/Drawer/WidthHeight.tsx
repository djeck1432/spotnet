import { useState } from 'react'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'

const WidthHeight = () => {
    const [verticalOpen, setVerticalOpen] = useState(false)
    const [horizontalOpen, setHorizontalOpen] = useState(false)

    const onVerticalOpen = () => {
        setVerticalOpen(true)
    }

    const onHorizontalOpen = () => {
        setHorizontalOpen(true)
    }

    const onDrawerClose = () => {
        setVerticalOpen(false)
        setHorizontalOpen(false)
    }

    return (
        <div>
            <Button
                variant="twoTone"
                className="mx-2"
                onClick={() => onVerticalOpen()}
            >
                Vertical Drawer
            </Button>
            <Button variant="twoTone" onClick={() => onHorizontalOpen()}>
                Horizontal Drawer
            </Button>
            <Drawer
                title="Vertical Drawer"
                isOpen={verticalOpen}
                placement="right"
                width={600}
                onClose={onDrawerClose}
                onRequestClose={onDrawerClose}
            >
                Drawer Content
            </Drawer>
            <Drawer
                title="Horizontal Drawer"
                isOpen={horizontalOpen}
                placement="bottom"
                height={300}
                onClose={onDrawerClose}
                onRequestClose={onDrawerClose}
            >
                Drawer Content
            </Drawer>
        </div>
    )
}

export default WidthHeight
