import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetScrumBoards,
    apiGetScrumBoardtMembers,
} from '@/services/ProjectService'
import type { Members, Columns } from '../types'

type GetScrumBoardsResponse = Columns

type GetScrumBoardtMembersResponse = {
    participantMembers: Members
    allMembers: Members
}

export type ScrumBoardState = {
    loading: boolean
    columns: Columns
    ordered: string[]
    boardMembers: Members
    allMembers: Members
    dialogOpen: boolean
    dialogView: 'NEW_COLUMN' | 'TICKET' | 'ADD_MEMBER' | 'NEW_TICKET' | ''
    ticketId: string
    board: string
    selectedTab: string
}

export const SLICE_NAME = 'scrumBoard'

export const getBoards = createAsyncThunk(
    SLICE_NAME + '/getBoards',
    async () => {
        const response = await apiGetScrumBoards<GetScrumBoardsResponse>()
        return response.data
    },
)

export const getMembers = createAsyncThunk(
    SLICE_NAME + '/getMembers',
    async () => {
        const response =
            await apiGetScrumBoardtMembers<GetScrumBoardtMembersResponse>()
        return response.data
    },
)

const initialState: ScrumBoardState = {
    loading: false,
    columns: {},
    ordered: [],
    boardMembers: [],
    allMembers: [],
    dialogOpen: false,
    dialogView: '',
    ticketId: '',
    board: '',
    selectedTab: 'All',
}

const scrumBoardSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateOrdered: (state, action) => {
            state.ordered = action.payload
        },
        updateColumns: (state, action) => {
            state.columns = action.payload
        },
        updateBoardMembers: (state, action) => {
            state.boardMembers = action.payload
        },
        openDialog: (state) => {
            state.dialogOpen = true
        },
        closeDialog: (state) => {
            state.dialogOpen = false
            state.ticketId = ''
            state.board = ''
            state.dialogView = ''
        },
        updateDialogView: (state, action) => {
            state.dialogView = action.payload
        },
        setSelectedTicketId: (state, action) => {
            state.ticketId = action.payload
        },
        setSelectedBoard: (state, action) => {
            state.board = action.payload
        },
        setSelectedTab: (state, action) => {
            state.selectedTab = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBoards.fulfilled, (state, { payload }) => {
                state.columns = payload
                state.ordered = Object.keys(payload)
                state.loading = false
            })
            .addCase(getBoards.pending, (state) => {
                state.loading = true
            })
            .addCase(getMembers.fulfilled, (state, action) => {
                state.boardMembers = action.payload.participantMembers
                state.allMembers = action.payload.allMembers
            })
    },
})

export const {
    updateOrdered,
    updateColumns,
    updateBoardMembers,
    openDialog,
    updateDialogView,
    closeDialog,
    setSelectedTicketId,
    setSelectedBoard,
    setSelectedTab,
} = scrumBoardSlice.actions

export default scrumBoardSlice.reducer
