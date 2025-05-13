```jsx
import Alert from '@/components/ui/Alert'
import toast from '@/components/ui/toast'
import Button from '@/components/ui/Button'

const AlertToast = () => {
    function blockAlert() {
        toast.push(
            <Alert showIcon closable type="success" rounded={false}>
                Success
            </Alert>,
            {
                offsetX: 0,
                offsetY: 0,
                transitionType: 'fade',
                block: true,
            },
        )
    }

    return (
        <div>
            <Button className="mr-2" onClick={blockAlert}>
                Show Alert
            </Button>
        </div>
    )
}

export default AlertToast
```
