```jsx
import { useState } from 'react'
import Button from '@/components/ui/Button'
import { HiOutlineCog, HiOutlinePencil, HiOutlineInboxIn } from 'react-icons/hi'

const ButtonWithIcon = () => {
    const [loading, setLoading] = useState(false)

    const onClick = () => {
        setLoading(true)

        setTimeout(() => {
            setLoading(false)
        }, 3000)
    }

    return (
        <div className="flex-wrap inline-flex xl:flex items-center gap-2">
            <Button className="mr-2" icon={<HiOutlinePencil />}>
                <span>Edit</span>
            </Button>
            <Button className="mr-2" variant="twoTone" icon={<HiOutlineCog />}>
                <span>
                    <span>Settings</span>
                </span>
            </Button>
            <Button
                className="mr-2"
                variant="solid"
                onClick={onClick}
                loading={loading}
                icon={<HiOutlineInboxIn />}
            >
                <span>With Loading (Click to trigger)</span>
            </Button>
        </div>
    )
}

export default ButtonWithIcon
```
