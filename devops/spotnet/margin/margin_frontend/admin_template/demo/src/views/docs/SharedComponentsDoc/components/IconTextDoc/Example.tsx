import IconText from '@/components/shared/IconText'
import { HiClock } from 'react-icons/hi'

const Example = () => {
    return (
        <IconText
            className="text-emerald-500 text-sm font-semibold"
            icon={<HiClock className="text-lg" />}
        >
            In Progress
        </IconText>
    )
}

export default Example
