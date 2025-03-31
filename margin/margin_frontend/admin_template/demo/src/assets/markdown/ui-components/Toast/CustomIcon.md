```jsx
import toast from '@/components/ui/toast'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import Avatar from '@/components/ui/Avatar'
import { HiOutlineGift } from 'react-icons/hi'

const CustomIcon = () => {
    const notificationWithIcon = (
        <Notification
            title="You received a Gift!"
            customIcon={<HiOutlineGift className="text-2xl text-indigo-600" />}
        >
            Something you may like.
        </Notification>
    )

    const notificationWithAvatar = (
        <Notification
            title="Emily Gale"
            customIcon={
                <Avatar shape="circle" src="/img/avatars/thumb-1.jpg" />
            }
        >
            Sent you a friend request.
        </Notification>
    )

    function openNotification(type: string) {
        toast.push(
            type === 'icon' ? notificationWithIcon : notificationWithAvatar
        )
    }

    return (
        <div>
            <Button className="mr-2" onClick={() => openNotification('icon')}>
                Custom icon
            </Button>
            <Button onClick={() => openNotification('avatar')}>Avatar</Button>
        </div>
    )
}

export default CustomIcon
```
