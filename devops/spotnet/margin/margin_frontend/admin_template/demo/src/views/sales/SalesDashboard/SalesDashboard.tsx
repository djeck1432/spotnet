import reducer from './store'
import { injectReducer } from '@/store'
import SalesDashboardHeader from './components/SalesDashboardHeader'
import SalesDashboardBody from './components/SalesDashboardBody'

injectReducer('salesDashboard', reducer)

const SalesDashboard = () => {
    return (
        <div className="flex flex-col gap-4 h-full">
            <SalesDashboardHeader />
            <SalesDashboardBody />
        </div>
    )
}

export default SalesDashboard
