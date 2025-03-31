import Affix from '@/components/shared/Affix'
import Button from '@/components/ui/Button'

const Basic = () => {
    return (
        <div className="flex flex-col justify-between">
            <Affix className="z-50">
                <Button variant="solid">This will stick to top</Button>
            </Affix>
            <div className="text-xl">
                <br />
                Scroll down
                <br />
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

export default Basic
