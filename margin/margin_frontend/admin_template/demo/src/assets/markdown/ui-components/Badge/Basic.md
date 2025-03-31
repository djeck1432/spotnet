```jsx
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { HiOutlineUser } from 'react-icons/hi'

const Basic = () => {
    return (
        <div className="flex items-center">
            <Badge className="mr-4" content={9}>
                <Avatar icon={<HiOutlineUser />} />
            </Badge>
            <Badge className="mr-4" content={'New'}>
                <Avatar icon={<HiOutlineUser />} />
            </Badge>
        </div>
    )
}

export default Basic
```
