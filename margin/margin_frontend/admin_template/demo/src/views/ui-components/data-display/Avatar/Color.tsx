import Avatar from '@/components/ui/Avatar'
import { HiOutlineUser } from 'react-icons/hi'

const Color = () => {
    return (
        <div className="flex items-center">
            <Avatar className="mr-4 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100">
                A
            </Avatar>
            <Avatar className="mr-4 bg-emerald-500" icon={<HiOutlineUser />} />
        </div>
    )
}

export default Color
