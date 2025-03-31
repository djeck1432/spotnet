import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetMarketData } from '@/services/CryptoService'
import type { TableQueries } from '@/@types/common'

export type AllMarket = {
    name: string
    symbol: string
    price: number
    change: number
    volumn: number
    marketCap: number
    img: string
}

export type Spot = {
    name: string
    symbol: string
    amount: number
    price: number
    change: number
    turnOver: number
    volumn: number
    high: number
    low: number
}

export type Future = {
    name: string
    symbol: string
    amount: number
    price: number
    change: number
    turnOver: number
    volumn: number
    high: number
    low: number
}

export type Row = AllMarket | Spot | Future

type MarketData = AllMarket[] | Spot[] | Future[]

type GetMarketDataRequest = {
    tab: string
} & TableQueries

type GetMarketDataResponse = {
    data: MarketData
    total: number
}

export type CryptoMarketState = {
    loading: boolean
    marketData: MarketData
    tableData: TableQueries
    selectedTab: string
    tradeDialogOpen: boolean
    selectedRow: Partial<Row>
}

export const SLICE_NAME = 'cryptoMarket'

export const getMarketData = createAsyncThunk(
    SLICE_NAME + '/getMarketData',
    async (data: GetMarketDataRequest) => {
        const response = await apiGetMarketData<
            GetMarketDataResponse,
            GetMarketDataRequest
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

const initialState: CryptoMarketState = {
    loading: true,
    marketData: [],
    tableData: initialTableData,
    selectedTab: 'all',
    tradeDialogOpen: false,
    selectedRow: {},
}

const marketSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setSelectedTab: (state, action) => {
            state.selectedTab = action.payload
        },
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setMarketData: (state, action) => {
            state.marketData = action.payload
        },
        toggleTradeDialog: (state, action) => {
            state.tradeDialogOpen = action.payload
        },
        setSelectedRow: (state, action) => {
            state.selectedRow = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMarketData.fulfilled, (state, action) => {
                state.loading = false
                state.tableData.total = action.payload.total
                state.marketData = action.payload.data
            })
            .addCase(getMarketData.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    setSelectedTab,
    setTableData,
    setMarketData,
    toggleTradeDialog,
    setSelectedRow,
} = marketSlice.actions

export default marketSlice.reducer
