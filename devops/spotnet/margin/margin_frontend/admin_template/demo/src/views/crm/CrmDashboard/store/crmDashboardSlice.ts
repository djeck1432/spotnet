import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetCrmDashboardData } from '@/services/CrmService'

export type Statistic = {
    key: string
    label: string
    value: number
    growShrink: number
}

export type LeadRegion = {
    name: string
    value: number
}

export type Lead = {
    id: number
    name: string
    avatar: string
    status: number
    createdTime: number
    email: string
    assignee: string
}

export type Emails = {
    precent: number
    opened: number
    unopen: number
    total: number
}

export type DashboardData = {
    statisticData: Statistic[]
    leadByRegionData: LeadRegion[]
    recentLeadsData: Lead[]
    emailSentData: {
        precent: number
        opened: number
        unopen: number
        total: number
    }
}

type CrmDashboardDataResponse = DashboardData

export type CrmDashboardState = {
    loading: boolean
    dashboardData: Partial<DashboardData>
}

export const SLICE_NAME = 'crmDashboard'

export const getCrmDashboardData = createAsyncThunk(
    'crmDashboard/data/getCrmDashboardData',
    async () => {
        const response =
            await apiGetCrmDashboardData<CrmDashboardDataResponse>()
        return response.data
    },
)

const initialState: CrmDashboardState = {
    loading: true,
    dashboardData: {},
}

const crmDashboardSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCrmDashboardData.fulfilled, (state, action) => {
                state.dashboardData = action.payload
                state.loading = false
            })
            .addCase(getCrmDashboardData.pending, (state) => {
                state.loading = true
            })
    },
})

export default crmDashboardSlice.reducer
