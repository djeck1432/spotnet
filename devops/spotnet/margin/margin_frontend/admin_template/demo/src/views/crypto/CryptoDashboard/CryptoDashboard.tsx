import { useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import PortfolioStats from './components/PortfolioStats'
import FastTrade from './components/FastTrade'
import Holding from './components/Holding'
import RecentActivities from './components/RecentActivities'
import MarketValue from './components/MarketValue'
import { injectReducer } from '@/store'
import reducer, {
    getCryptoDashboardData,
    useAppDispatch,
    useAppSelector,
} from './store'

injectReducer('cryptoDashboard', reducer)

const CryptoDashboard = () => {
    const dispatch = useAppDispatch()

    const {
        portfolioStatsData,
        recentAcivityData,
        marketValueData,
        holdingsData,
    } = useAppSelector((state) => state.cryptoDashboard.data.dashboardData)
    const loading = useAppSelector(
        (state) => state.cryptoDashboard.data.loading,
    )

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchData = () => {
        dispatch(getCryptoDashboardData())
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            <Loading loading={loading}>
                <div className="grid grid-cols-1 xl:grid-cols-11 gap-4">
                    <PortfolioStats
                        className="2xl:col-span-8 xl:col-span-7"
                        data={portfolioStatsData}
                    />
                    <FastTrade className="2xl:col-span-3 xl:col-span-4" />
                </div>
                <Holding data={holdingsData} />
                <div className="grid grid-cols-1 xl:grid-cols-11 gap-4">
                    <MarketValue
                        className="2xl:col-span-8 xl:col-span-7"
                        data={marketValueData}
                    />
                    <RecentActivities
                        className="2xl:col-span-3 xl:col-span-4"
                        data={recentAcivityData}
                    />
                </div>
            </Loading>
        </div>
    )
}

export default CryptoDashboard
