import Alert from '@/components/ui/Alert'

const Closable = () => {
    const onCloseClick = () => {
        console.log('Alert closed!')
    }

    return (
        <div>
            <Alert closable type="success" onClose={onCloseClick}>
                Thanks for submitting your application. Our team will get back
                to you soon.
            </Alert>
        </div>
    )
}

export default Closable
