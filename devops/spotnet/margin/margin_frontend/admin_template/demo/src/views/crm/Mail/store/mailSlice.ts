import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetCrmMails, apiGetCrmMail } from '@/services/CrmService'

export type Category = {
    category: string
    value?: string
    label?: string
}

type Message = {
    id: number
    name: string
    mail: string[]
    from: string
    avatar: string
    date: string
    content: string
    attachment: {
        file: string
        size: string
        type: string
    }[]
}

export type Mail = {
    id: number
    name: string
    label: string
    group: string
    flagged: boolean
    starred: boolean
    from: string
    avatar: string
    title: string
    mail: string[]
    message: Message[]
}

type GetCrmMailsRequest = Category

type GetCrmMailsResponse = Mail[]

type GetCrmMailRequest = { id: string }

type GetCrmMailResponse = Mail

export type MailState = {
    mailListLoading: boolean
    mailLoading: boolean
    mailList: Mail[]
    mail: Partial<Mail>
    selectedMailId: string | number
    sideBarExpand: boolean
    mobileSideBarExpand: boolean
    selectedCategory: Partial<Category>
    reply: boolean
    newMessageDialog: boolean
}

export const SLICE_NAME = 'crmMail'

export const getMails = createAsyncThunk(
    SLICE_NAME + '/getMails',
    async (params: GetCrmMailsRequest) => {
        const response = await apiGetCrmMails<
            GetCrmMailsResponse,
            GetCrmMailsRequest
        >(params)
        return response.data
    },
)

export const getMail = createAsyncThunk(
    SLICE_NAME + '/getMail',
    async (params: GetCrmMailRequest) => {
        const response = await apiGetCrmMail<
            GetCrmMailResponse,
            GetCrmMailRequest
        >(params)
        return response.data
    },
)

const initialState: MailState = {
    mailListLoading: false,
    mailLoading: false,
    mailList: [],
    mail: {},
    selectedMailId: '',
    sideBarExpand: true,
    mobileSideBarExpand: false,
    selectedCategory: {},
    reply: false,
    newMessageDialog: false,
}

const mailSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateMailList: (state, action) => {
            state.mailList = action.payload
        },
        updateMail: (state, action) => {
            state.mail = action.payload
        },
        updateMailId: (state, action) => {
            if (action.payload) {
                state.mailLoading = true
            }
            state.selectedMailId = action.payload
        },
        updateReply: (state, action) => {
            state.reply = action.payload
        },
        toggleSidebar: (state, action) => {
            state.sideBarExpand = action.payload
        },
        toggleMobileSidebar: (state, action) => {
            state.mobileSideBarExpand = action.payload
        },
        toggleNewMessageDialog: (state, action) => {
            state.newMessageDialog = action.payload
        },
        updateSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMails.fulfilled, (state, action) => {
                state.mailListLoading = false
                state.mailList = action.payload
            })
            .addCase(getMails.pending, (state) => {
                state.mailListLoading = true
            })
            .addCase(getMail.fulfilled, (state, action) => {
                state.mailLoading = false
                state.mail = action.payload
            })
            .addCase(getMail.pending, (state) => {
                state.mailLoading = true
            })
    },
})

export const {
    updateMailList,
    updateMail,
    updateMailId,
    updateReply,
    toggleSidebar,
    toggleMobileSidebar,
    toggleNewMessageDialog,
    updateSelectedCategory,
} = mailSlice.actions

export default mailSlice.reducer
