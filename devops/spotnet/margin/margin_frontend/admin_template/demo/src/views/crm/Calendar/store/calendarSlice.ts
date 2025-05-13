import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetCrmCalendar } from '@/services/CrmService'

type Event = {
    id: string
    title: string
    start: string
    end?: string
    eventColor: string
    groupId?: undefined
}

type Events = Event[]

type GetCrmCalendarResponse = Events

export type CalendarState = {
    loading: boolean
    eventList: Events
    dialogOpen: boolean
    selected: {
        type: string
    } & Partial<Event>
}

export const SLICE_NAME = 'crmCalendar'

export const getEvents = createAsyncThunk(
    SLICE_NAME + '/getEvents',
    async () => {
        const response = await apiGetCrmCalendar<GetCrmCalendarResponse>()
        return response.data
    },
)

const initialState: CalendarState = {
    loading: false,
    eventList: [],
    dialogOpen: false,
    selected: {
        type: '',
    },
}

const calendarSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateEvent: (state, action) => {
            state.eventList = action.payload
        },
        openDialog: (state) => {
            state.dialogOpen = true
        },
        closeDialog: (state) => {
            state.dialogOpen = false
        },
        setSelected: (state, action) => {
            state.selected = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getEvents.fulfilled, (state, action) => {
            state.eventList = action.payload
        })
    },
})

export const { updateEvent, openDialog, closeDialog, setSelected } =
    calendarSlice.actions

export default calendarSlice.reducer
