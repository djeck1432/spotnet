import { useEffect, useRef } from 'react'
import Tabs from '@/components/ui/Tabs'
import AdaptableCard from '@/components/shared/AdaptableCard'
import reducer, {
    getMarketData,
    setSelectedTab,
    setTableData,
    setMarketData,
    initialTableData,
    useAppDispatch,
    useAppSelector,
    AllMarket,
    Spot,
    Future,
} from './store'
import { injectReducer } from '@/store'
import cloneDeep from 'lodash/cloneDeep'
import AllTable from './components/AllTable'
import SpotTable from './components/SpotTable'
import FuturesTable from './components/FuturesTable'
import TradeDialog from './components/TradeDialog'
import QueryInput from './components/QueryInput'

injectReducer('cryptoMarket', reducer)

const { TabNav, TabList, TabContent } = Tabs

const Market = () => {
    const dispatch = useAppDispatch()

    const inputRef = useRef(null)

    const data = useAppSelector((state) => state.cryptoMarket.data.marketData)

    const loading = useAppSelector((state) => state.cryptoMarket.data.loading)

    const selectedTab = useAppSelector(
        (state) => state.cryptoMarket.data.selectedTab,
    )

    const tableData = useAppSelector(
        (state) => state.cryptoMarket.data.tableData,
    )

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, selectedTab, tableData])

    const fetchData = () => {
        dispatch(getMarketData({ tab: selectedTab, ...tableData }))
    }

    const handleTabChange = (val: string) => {
        dispatch(setMarketData([]))
        dispatch(setSelectedTab(val))
        dispatch(setTableData(initialTableData))
    }

    const handleInputChange = (val: string) => {
        const newTableData = cloneDeep(tableData)
        newTableData.query = val
        newTableData.pageIndex = 1
        if (typeof val === 'string' && val.length > 1) {
            dispatch(setTableData(newTableData))
        }

        if (typeof val === 'string' && val.length === 0) {
            dispatch(setTableData(newTableData))
        }
    }

    return (
        <>
            <AdaptableCard>
                <Tabs
                    value={selectedTab}
                    variant="pill"
                    onChange={handleTabChange}
                >
                    <div className="flex lg:items-center justify-between flex-col lg:flex-row gap-4">
                        <TabList>
                            <TabNav value="all">All</TabNav>
                            <TabNav value="spot">Spot</TabNav>
                            <TabNav value="futures">Futures</TabNav>
                        </TabList>
                        <QueryInput
                            ref={inputRef}
                            onInputChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-4">
                        <TabContent value="all">
                            <AllTable
                                {...{
                                    data: data as AllMarket[],
                                    loading,
                                    tableData,
                                }}
                            />
                        </TabContent>
                        <TabContent value="spot">
                            <SpotTable
                                {...{
                                    data: data as Spot[],
                                    loading,
                                    tableData,
                                }}
                            />
                        </TabContent>
                        <TabContent value="futures">
                            <FuturesTable
                                {...{
                                    data: data as Future[],
                                    loading,
                                    tableData,
                                }}
                            />
                        </TabContent>
                    </div>
                </Tabs>
            </AdaptableCard>
            <TradeDialog />
        </>
    )
}

export default Market
