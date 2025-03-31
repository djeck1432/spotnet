import MailList from './MailList'
import MailDetail from './MailDetail'

const MailBody = () => {
    return (
        <div className="flex flex-auto w-full">
            <MailList />
            <MailDetail />
        </div>
    )
}

export default MailBody
