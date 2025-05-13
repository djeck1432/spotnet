```jsx
import Avatar from '@/components/ui/Avatar'
import { HiOutlineUser } from 'react-icons/hi'

const Size = () => {
    return (
        <div className="flex items-center">
            <Avatar size="sm" className="mr-4" icon={<HiOutlineUser />} />
            <Avatar className="mr-4" icon={<HiOutlineUser />} />
            <Avatar size="lg" className="mr-4" icon={<HiOutlineUser />} />
            <Avatar size={60} className="mr-4" icon={<HiOutlineUser />} />
        </div>
    )
}

export default Size
```
