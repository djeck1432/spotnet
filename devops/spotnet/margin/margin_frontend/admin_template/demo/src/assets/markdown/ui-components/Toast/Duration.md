```jsx
import toast from '@/components/ui/toast'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'

const Duration = () => {
    function notificationNeverClose() {
        toast.push(
            <Notification closable type="success" duration={0}>
                Success
            </Notification>,
        )
    }

    function closeAfter2000ms() {
        toast.push(
            <Notification closable type="success" duration={2000}>
                Success
            </Notification>,
        )
    }

    return (
        <div>
            <Button className="mr-2" onClick={notificationNeverClose}>
                Persist
            </Button>
            <Button className="mr-2" onClick={closeAfter2000ms}>
                Close after 2s
            </Button>
        </div>
    )
}

export default Duration
```
