import Input from '@/components/ui/Input'
import Tooltip from '@/components/ui/Tooltip'
import { HiOutlineUser, HiOutlineExclamationCircle } from 'react-icons/hi'

const Affix = () => {
    return (
        <div>
            <div className="mb-4">
                <Input
                    placeholder="Enter your name"
                    prefix={<HiOutlineUser className="text-lg" />}
                />
            </div>
            <div className="mb-4">
                <Input
                    placeholder="Enter your rate"
                    suffix={
                        <Tooltip title="Field info">
                            <HiOutlineExclamationCircle className="text-lg cursor-pointer ml-1" />
                        </Tooltip>
                    }
                />
            </div>
            <div className="mb-4">
                <Input prefix="$" suffix=".00" />
            </div>
        </div>
    )
}

export default Affix
