import toast from '@/components/ui/toast'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'

const Placement = () => {
    const openNotification = (
        placement:
            | 'top-start'
            | 'top-center'
            | 'top-end'
            | 'bottom-start'
            | 'bottom-center'
            | 'bottom-end',
    ) => {
        toast.push(<Notification type="success" title="Message" />, {
            placement: placement,
        })
    }

    return (
        <div className="grid md:grid-cols-3 gap-4 max-w-xl">
            <Button
                className="mb-2"
                onClick={() => openNotification('top-start')}
            >
                Top Start
            </Button>
            <Button
                className="mb-2"
                onClick={() => openNotification('top-center')}
            >
                Top Center
            </Button>
            <Button
                className="mb-2"
                onClick={() => openNotification('top-end')}
            >
                Top End
            </Button>
            <Button
                className="mb-2"
                onClick={() => openNotification('bottom-start')}
            >
                Bottom Start
            </Button>
            <Button
                className="mb-2"
                onClick={() => openNotification('bottom-center')}
            >
                Bottom Center
            </Button>
            <Button
                className="mb-2"
                onClick={() => openNotification('bottom-end')}
            >
                Bottom End
            </Button>
        </div>
    )
}

export default Placement
