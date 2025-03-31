```jsx
import Affix from '@/components/shared/Affix'
import Button from '@/components/ui/Button'

const Offset = () => {
    return (
        <div className="flex flex-col justify-between">
            <Affix offset={80} className="z-50">
                <Button variant="solid">
                    This will stick to top with 80px offset
                </Button>
            </Affix>
            <div className="text-xl">
                <br />
                Scroll down
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                👇
                <br />
                <br />
            </div>
        </div>
    )
}

export default Offset
```
