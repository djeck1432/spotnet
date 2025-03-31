import AdaptableCard from '@/components/shared/AdaptableCard'
import MailSidebar from './components/MailSidebar'
import MailBody from './components/MailBody'
import { injectReducer } from '@/store/'
import reducer from './store'

injectReducer('crmMail', reducer)

const Mail = () => {
    return (
        <AdaptableCard
            className="h-full overflow-hidden"
            bodyClass="p-0 h-full absolute inset-0 flex min-w-0 overflow-hidden"
        >
            <MailSidebar />
            <MailBody />
        </AdaptableCard>
    )
}

export default Mail
