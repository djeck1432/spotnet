import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import Log from './components/Log'
import LogFilter from './components/LogFilter'
import reducer from './store'
import { injectReducer } from '@/store'

injectReducer('accountActivityLog', reducer)

const ActivityLog = () => {
    return (
        <Container>
            <AdaptableCard>
                <div className="grid lg:grid-cols-5 gap-8 ">
                    <div className="col-span-4 order-last md:order-first">
                        <h3 className="mb-6">Activity Log</h3>
                        <Log />
                    </div>
                    <LogFilter />
                </div>
            </AdaptableCard>
        </Container>
    )
}

export default ActivityLog
