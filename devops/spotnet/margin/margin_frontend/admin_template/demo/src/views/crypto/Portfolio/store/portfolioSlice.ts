import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetPortfolioData } from '@/services/CryptoService'

export type Assets = {
    labels: string[]
    values: number[]
    coinValues: number[]
    coinSymbol: string[]
}

export type AccountValue = {
    netValue: number
    coinValue: number
    cashBalance: number
}

export type OverviewData = {
    series: {
        name: string
        data: number[]
    }[]
    date: string[]
}

export type Acivity = {
    date: string
    data: {
        coinValue: number
        fiatValue: number
        symbol: string
        curency: string
        action: string
        actionType: number
    }[]
}

type Porfolio = {
    assetsData: Assets
    accountValueData: AccountValue
    overviewData: OverviewData
    recentAcivity: Acivity[]
}

type GetPortfolioDataResponse = Porfolio

export type CryptoPortfolioState = {
    loading: boolean
    portfolioData: Partial<Porfolio>
}

export const SLICE_NAME = 'cryptoPortfolio'

export const getPortfolioData = createAsyncThunk(
    SLICE_NAME + '/getPortfolioData',
    async () => {
        const response = await apiGetPortfolioData<GetPortfolioDataResponse>()
        return response.data
    },
)

const initialState: CryptoPortfolioState = {
    loading: true,
    portfolioData: {},
}

const portfolioSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPortfolioData.fulfilled, (state, action) => {
                state.loading = false
                state.portfolioData = action.payload
            })
            .addCase(getPortfolioData.pending, (state) => {
                state.loading = true
            })
    },
})

export default portfolioSlice.reducer
