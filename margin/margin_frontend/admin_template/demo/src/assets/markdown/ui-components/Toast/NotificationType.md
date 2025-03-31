```jsx
import toast from '@/components/ui/toast'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'

const NotificationType = () => {
    const openNotification = (
        type: 'success' | 'warning' | 'danger' | 'info'
    ) => {
        toast.push(
            <Notification
                title={type.charAt(0).toUpperCase() + type.slice(1)}
                type={type}
            >
                The fat cat sat on the mat bat away with paws annoy owner.
            </Notification>
        )
    }

    return (
        <div>
            <Button
                className="mr-2 mb-2"
                onClick={() => openNotification('success')}
            >
                Success
            </Button>
            <Button
                className="mr-2 mb-2"
                onClick={() => openNotification('info')}
            >
                Info
            </Button>
            <Button
                className="mr-2 mb-2"
                onClick={() => openNotification('danger')}
            >
                Danger
            </Button>
            <Button
                className="mr-2 mb-2"
                onClick={() => openNotification('warning')}
            >
                Warning
            </Button>
        </div>
    )
}

export default NotificationType
```
