import DatePicker from '@/components/ui/DatePicker'
import 'dayjs/locale/ko'

const Localization = () => {
    return <DatePicker locale="ko" defaultValue={new Date()} inputFormat="LL" />
}

export default Localization
