import { useEffect } from 'react'
import {
    getTransctionHistoryData,
    setSelectedTab,
    setTableData,
    initialTableData,
    setTransactionHistoryData,
    useAppDispatch,
    useAppSelector,
    Trade,
    TransactionDetails,
} from '../store'
import Card from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import OrderTable from './OrderTable'
import DepositWithdrawalTable from './DepositWithdrawalTable'

const { TabNav, TabList, TabContent } = Tabs

const TransactionHistory = () => {
    const dispatch = useAppDispatch()

    const data = useAppSelector(
        (state) => state.cryptoWallets.data.transactionHistoryData,
    )

    const loading = useAppSelector(
        (state) => state.cryptoWallets.data.transactionHistoryLoading,
    )

    const selectedTab = useAppSelector(
        (state) => state.cryptoWallets.data.selectedTab,
    )

    const tableData = useAppSelector(
        (state) => state.cryptoWallets.data.tableData,
    )

    useEffect(() => {
        dispatch(getTransctionHistoryData({ tab: selectedTab, ...tableData }))
    }, [dispatch, selectedTab, tableData])

    const handleTabChange = (val: string) => {
        dispatch(setTransactionHistoryData([]))
        dispatch(setSelectedTab(val))
        dispatch(setTableData(initialTableData))
    }

    return (
        <Card>
            <h4 className="mb-4">Transaction History</h4>
            <Tabs value={selectedTab} variant="pill" onChange={handleTabChange}>
                <TabList>
                    <TabNav value="trade">Trade</TabNav>
                    <TabNav value="deposit">Deposit</TabNav>
                    <TabNav value="withdraw">Withdraw</TabNav>
                </TabList>
                <div className="mt-4">
                    <TabContent value="trade">
                        <OrderTable
                            data={data as Trade[]}
                            loading={loading}
                            tableData={tableData}
                        />
                    </TabContent>
                    <TabContent value="deposit">
                        <DepositWithdrawalTable
                            data={data as TransactionDetails[]}
                            loading={loading}
                            tableData={tableData}
                        />
                    </TabContent>
                    <TabContent value="withdraw">
                        <DepositWithdrawalTable
                            data={data as TransactionDetails[]}
                            loading={loading}
                            tableData={tableData}
                        />
                    </TabContent>
                </div>
            </Tabs>
        </Card>
    )
}

export default TransactionHistory
