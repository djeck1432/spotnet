```jsx
import Avatar from '@/components/ui/Avatar'
import { HiOutlineUser } from 'react-icons/hi'

const Type = () => {
    return (
        <div className="flex items-center">
            <Avatar className="mr-4">AT</Avatar>
            <Avatar className="mr-4" icon={<HiOutlineUser />} />
            <Avatar className="mr-4" src="/img/avatars/thumb-1.jpg" />
        </div>
    )
}

export default Type
```
