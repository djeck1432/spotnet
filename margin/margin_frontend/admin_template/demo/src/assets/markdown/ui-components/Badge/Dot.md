```jsx
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { HiOutlineUser } from 'react-icons/hi'

const Dot = () => {
    return (
        <div className="flex">
            <Badge className="mr-4">
                <Avatar icon={<HiOutlineUser />} />
            </Badge>
        </div>
    )
}

export default Dot
```
