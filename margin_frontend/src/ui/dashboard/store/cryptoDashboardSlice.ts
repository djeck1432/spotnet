import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetCryptoDashboardData } from '@/services/CryptoService'

type Stat = {
    series: {
        name: string
        data: number[]
    }[]
    timeRange: string[]
}

export type PortfolioStats = Record<string, Stat>

export type Acivity = {
    coinValue: number
    fiatValue: number
    symbol: string
    curency: string
    action: string
    actionType: number
}

export type Market = {
    name: string
    symbol: string
    price: number
    change: number
    volumn: number
    marketCap: number
    img: string
}

export type Holding = {
    icon: string
    symbol: string
    name: string
    fiatValue: number
    coinValue: number
    growshrink: number
    address: string
}

export type DashboardData = {
    portfolioStatsData: PortfolioStats
    recentAcivityData: { date: string; data: Acivity[] }[]
    marketValueData: Market[]
    holdingsData: Holding[]
}

type GetCryptoDashboardDataResponse = DashboardData

export type CryptoDashboardState = {
    loading: boolean
    dashboardData: Partial<DashboardData>
    tradeDialogOpen: boolean
}

const initialState: CryptoDashboardState = {
    loading: true,
    dashboardData: {},
    tradeDialogOpen: false,
}

export const SLICE_NAME = 'cryptoDashboard'

export const getCryptoDashboardData = createAsyncThunk(
    SLICE_NAME + '/getCryptoDashboardData',
    async () => {
        const response =
            await apiGetCryptoDashboardData<GetCryptoDashboardDataResponse>()
        return response.data
    },
)

const cryptoDashboardSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        toggleTradeDialog: (state, action) => {
            state.tradeDialogOpen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCryptoDashboardData.fulfilled, (state, action) => {
                state.loading = false
                state.dashboardData = action.payload
            })
            .addCase(getCryptoDashboardData.pending, (state) => {
                state.loading = true
            })
    },
})

export const { toggleTradeDialog } = cryptoDashboardSlice.actions

export default cryptoDashboardSlice.reducer
