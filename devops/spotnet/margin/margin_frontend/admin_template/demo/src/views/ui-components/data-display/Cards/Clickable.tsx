import Card from '@/components/ui/Card'

const Clickable = () => {
    return (
        <div className="max-w-xs">
            <Card
                clickable
                className="hover:shadow-lg transition duration-150 ease-in-out"
                onClick={(e) => console.log('Card Clickable', e)}
            >
                <h5>Card title</h5>
                <p className="mt-2">
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                </p>
            </Card>
        </div>
    )
}

export default Clickable
