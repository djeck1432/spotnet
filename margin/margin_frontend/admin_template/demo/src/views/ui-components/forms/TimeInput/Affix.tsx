import TimeInput from '@/components/ui/TimeInput'
import { HiOutlineClock, HiClock } from 'react-icons/hi'

const Affix = () => {
    return (
        <div className="flex flex-col gap-5">
            <TimeInput
                prefix={<HiOutlineClock className="text-lg" />}
                suffix={null}
            />
            <TimeInput suffix={<HiClock className="text-lg" />} />
        </div>
    )
}

export default Affix
