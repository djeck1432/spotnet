import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetWalletData,
    apiGetTransctionHistoryData,
} from '@/services/CryptoService'
import type { TableQueries } from '@/@types/common'

export type Trade = {
    actionType: number
    status: number
    action: string
    date: number
    symbol: string
    price: number
    amount: number
}

export type TransactionDetails = {
    id: string
    date: number
    amount: number
    status: number
}

export type Wallet = {
    icon: string
    symbol: string
    name: string
    fiatValue: number
    coinValue: number
    growshrink: number
    address: string
}

export type Transaction = Trade[] | TransactionDetails[]

type GetTransctionHistoryDataResponse = {
    total: number
    data: Transaction
}

type GetWalletDataResponse = Wallet[]

export type CryptoWalletsState = {
    loading: boolean
    walletsData: Wallet[]
    transactionHistoryLoading: boolean
    transactionHistoryData: Transaction
    tableData: TableQueries
    selectedTab: string
}

export const SLICE_NAME = 'cryptoWallets'

export const getWalletData = createAsyncThunk(
    SLICE_NAME + '/getWalletData',
    async () => {
        const response = await apiGetWalletData<GetWalletDataResponse>()
        return response.data
    },
)

export const getTransctionHistoryData = createAsyncThunk(
    SLICE_NAME + '/getTransctionHistoryData',
    async (data: { tab: string } & TableQueries) => {
        const response = await apiGetTransctionHistoryData<
            GetTransctionHistoryDataResponse,
            TableQueries
        >(data)
        return response.data
    },
)

export const initialTableData: TableQueries = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

export const initialState: CryptoWalletsState = {
    loading: true,
    walletsData: [],
    transactionHistoryLoading: true,
    transactionHistoryData: [],
    tableData: initialTableData,
    selectedTab: 'trade',
}

const walletsSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setSelectedTab: (state, action) => {
            state.selectedTab = action.payload
        },
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setTransactionHistoryData: (state, action) => {
            state.transactionHistoryData = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getWalletData.fulfilled, (state, action) => {
                state.loading = false
                state.walletsData = action.payload
            })
            .addCase(getWalletData.pending, (state) => {
                state.loading = true
            })
            .addCase(getTransctionHistoryData.fulfilled, (state, action) => {
                state.transactionHistoryLoading = false
                state.tableData.total = action.payload.total
                state.transactionHistoryData = action.payload.data
            })
            .addCase(getTransctionHistoryData.pending, (state) => {
                state.transactionHistoryLoading = true
            })
    },
})

export const { setSelectedTab, setTableData, setTransactionHistoryData } =
    walletsSlice.actions

export default walletsSlice.reducer
