```jsx
import toast from '@/components/ui/toast'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'

const Closable = () => {
    const toastNotification = (
        <Notification closable title="Mesasge">
            The fat cat sat on the mat bat away with paws annoy owner.
        </Notification>
    )

    function openNotification() {
        toast.push(toastNotification)
    }

    return (
        <div>
            <Button onClick={openNotification}>Show toast</Button>
        </div>
    )
}

export default Closable
```
