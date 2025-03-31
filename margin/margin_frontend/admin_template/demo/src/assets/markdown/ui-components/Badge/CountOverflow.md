```jsx
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { HiOutlineUser } from 'react-icons/hi'

const CountOverflow = () => {
    return (
        <div className="flex">
            <Badge className="mr-5" content={10} maxCount={9}>
                <Avatar icon={<HiOutlineUser />} />
            </Badge>
            <Badge className="mr-4" content={100}>
                <Avatar icon={<HiOutlineUser />} />
            </Badge>
        </div>
    )
}

export default CountOverflow
```
