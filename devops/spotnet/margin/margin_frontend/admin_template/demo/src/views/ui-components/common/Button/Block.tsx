import Button from '@/components/ui/Button'

const Block = () => {
    return (
        <div>
            <Button block className="mb-5">
                Block
            </Button>
            <Button block variant="solid">
                Another Block
            </Button>
        </div>
    )
}

export default Block
