```jsx
import Button from '@/components/ui/Button'

const Color = () => {
    return (
        <>
            <div>
                <Button
                    className="mr-2 mb-2"
                    variant="twoTone"
                    color="blue-600"
                >
                    Blue
                </Button>
                <Button className="mr-2 mb-2" variant="solid" color="blue-600">
                    Blue
                </Button>
                <Button
                    className="mr-2 mb-2"
                    variant="twoTone"
                    color="green-600"
                >
                    Green
                </Button>
                <Button className="mr-2 mb-2" variant="solid" color="green-600">
                    Green
                </Button>
                <Button
                    className="mr-2 mb-2"
                    variant="twoTone"
                    color="yellow-600"
                >
                    Yellow
                </Button>
                <Button
                    className="mr-2 mb-2"
                    variant="solid"
                    color="yellow-600"
                >
                    Yellow
                </Button>
            </div>
            <div>
                <Button className="mr-2 mb-2" variant="twoTone" color="red-600">
                    Red
                </Button>
                <Button className="mr-2 mb-2" variant="solid" color="red-600">
                    Red
                </Button>
                <Button
                    className="mr-2 mb-2"
                    variant="twoTone"
                    color="purple-600"
                >
                    Purple
                </Button>
                <Button
                    className="mr-2 mb-2"
                    variant="solid"
                    color="purple-600"
                >
                    Purple
                </Button>
                <Button
                    className="mr-2 mb-2"
                    variant="twoTone"
                    color="pink-600"
                >
                    Pink
                </Button>
                <Button className="mr-2 mb-2" variant="solid" color="pink-600">
                    Pink
                </Button>
            </div>
        </>
    )
}

export default Color
```
