import InputGroup from '@/components/ui/InputGroup'
import Input from '@/components/ui/Input'

const { Addon } = InputGroup

const Addons = () => {
    return (
        <div>
            <InputGroup className="mb-4">
                <Addon>@</Addon>
                <Input />
            </InputGroup>
            <InputGroup className="mb-4">
                <Input />
                <Addon>.exmaple.com</Addon>
            </InputGroup>
            <InputGroup className="mb-4">
                <Addon>http://</Addon>
                <Input />
                <Addon>.com</Addon>
            </InputGroup>
            <InputGroup className="mb-4">
                <Input />
                <Addon>to</Addon>
                <Input />
            </InputGroup>
        </div>
    )
}

export default Addons
