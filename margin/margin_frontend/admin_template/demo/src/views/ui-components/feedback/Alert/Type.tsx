import Alert from '@/components/ui/Alert'

const Type = () => {
    return (
        <div>
            <Alert showIcon className="mb-4" type="info">
                Additional description and information about copywriting.
            </Alert>
            <Alert showIcon className="mb-4">
                Additional description and information about copywriting.
            </Alert>
            <Alert showIcon className="mb-4" type="success">
                Additional description and information about copywriting.
            </Alert>
            <Alert showIcon className="mb-4" type="danger">
                Additional description and information about copywriting.
            </Alert>
        </div>
    )
}

export default Type
