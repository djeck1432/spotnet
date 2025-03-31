import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { HiOutlineUser } from 'react-icons/hi'

const Status = () => {
    return (
        <div className="flex items-center">
            <Badge
                className="mr-4 rounded-full"
                badgeStyle={{ top: '7px', right: '5px' }}
            >
                <Avatar shape="circle" icon={<HiOutlineUser />} />
            </Badge>
            <Badge className="mr-4">
                <Avatar icon={<HiOutlineUser />} />
            </Badge>
            <Badge className="mr-4" innerClass="bg-emerald-500">
                <Avatar icon={<HiOutlineUser />} />
            </Badge>
            <Badge className="mr-4" content={99}>
                <Avatar icon={<HiOutlineUser />} />
            </Badge>
        </div>
    )
}

export default Status
