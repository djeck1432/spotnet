import DatePicker from '@/components/ui/DatePicker'
import { HiOutlineCalendar } from 'react-icons/hi'
import { TbCalendarStats } from 'react-icons/tb'

const InputAffix = () => {
    return (
        <div className="flex flex-col gap-5">
            <div>
                <div className="mb-1 font-semibold text-sm">Prefix:</div>
                <DatePicker
                    inputPrefix={<HiOutlineCalendar className="text-lg" />}
                    inputSuffix={null}
                />
            </div>
            <div>
                <div className="mb-1 font-semibold text-sm">Suffix:</div>
                <DatePicker
                    inputSuffix={<TbCalendarStats className="text-xl" />}
                />
            </div>
        </div>
    )
}

export default InputAffix
