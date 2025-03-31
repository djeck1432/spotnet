import toast from '@/components/ui/toast'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'

const CustomClose = () => {
    function closeNotification(key: string | Promise<string>) {
        if (typeof key !== 'string') {
            key.then((resolvedValue) => {
                toast.remove(resolvedValue)
            })
        } else {
            toast.remove(key)
        }
    }

    function openNotification() {
        const notificationKey = toast.push(
            <Notification title="Mesasge" duration={0}>
                <div>
                    The fat cat sat on the mat bat away with paws annoy owner.
                </div>
                <div className="text-right mt-3">
                    <Button
                        size="sm"
                        variant="solid"
                        className="mr-2"
                        onClick={() =>
                            closeNotification(
                                notificationKey as string | Promise<string>,
                            )
                        }
                    >
                        Confirm
                    </Button>
                    <Button
                        size="sm"
                        onClick={() =>
                            closeNotification(
                                notificationKey as string | Promise<string>,
                            )
                        }
                    >
                        Close
                    </Button>
                </div>
            </Notification>,
        )
    }

    return <Button onClick={openNotification}>Show toast</Button>
}

export default CustomClose
