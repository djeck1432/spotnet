import Button from '@/components/ui/Button'

const Color = () => {
    return (
        <>
            <div className="mb-3">
                <Button className="mr-2" variant="twoTone" color="rose-600">
                    Red
                </Button>
                <Button className="mr-2" variant="solid" color="rose-600">
                    Red
                </Button>
            </div>
            <div className="mb-3">
                <Button className="mr-2" variant="twoTone" color="orange-600">
                    Orange
                </Button>
                <Button className="mr-2" variant="solid" color="orange-500">
                    Orange
                </Button>
            </div>
            <div className="mb-3">
                <Button className="mr-2" variant="twoTone" color="emerald-600">
                    Emerald
                </Button>
                <Button className="mr-2" variant="solid" color="emerald-500">
                    Emerald
                </Button>
            </div>
            <div className="mb-3">
                <Button className="mr-2" variant="twoTone" color="sky-800">
                    Sky
                </Button>
                <Button className="mr-2" variant="solid" color="sky-500">
                    Sky
                </Button>
            </div>
        </>
    )
}

export default Color
