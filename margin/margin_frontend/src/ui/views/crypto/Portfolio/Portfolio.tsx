import { useEffect } from 'react'
import reducer, {
    getPortfolioData,
    useAppDispatch,
    useAppSelector,
} from './store'
import { injectReducer } from '@/store/'

import Loading from '@/components/shared/Loading'
import Assets from './components/Assets'
import Overview from './components/Overview'
import RecentAcivity from './components/RecentAcivity'
import AccountValues from './components/AccountValues'

injectReducer('cryptoPortfolio', reducer)

const Portfolio = () => {
    const dispatch = useAppDispatch()

    const { assetsData, overviewData, accountValueData, recentAcivity } =
        useAppSelector((state) => state.cryptoPortfolio.data.portfolioData)
    const loading = useAppSelector(
        (state) => state.cryptoPortfolio.data.loading,
    )

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchData = () => {
        dispatch(getPortfolioData())
    }

    return (
        <Loading loading={loading}>
            <div className="grid grid-cols-1 xl:grid-cols-11 gap-4">
                <Assets
                    className="2xl:col-span-8 xl:col-span-7"
                    data={assetsData}
                />
                <AccountValues
                    className="2xl:col-span-3 xl:col-span-4"
                    data={accountValueData}
                />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-11 gap-4 mt-4">
                <Overview
                    className="2xl:col-span-8 xl:col-span-7"
                    data={overviewData}
                />
                <RecentAcivity
                    className="2xl:col-span-3 xl:col-span-4"
                    data={recentAcivity}
                />
            </div>
        </Loading>
    )
}

export default Portfolio
