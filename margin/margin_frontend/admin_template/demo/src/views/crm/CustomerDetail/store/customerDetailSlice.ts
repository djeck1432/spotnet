import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetCrmCustomerDetails,
    apiDeleteCrmCustomer,
    apPutCrmCustomer,
} from '@/services/CrmService'

export const SLICE_NAME = 'crmCustomerDetails'

type PersonalInfo = {
    location: string
    title: string
    birthday: string
    phoneNumber: string
    facebook: string
    twitter: string
    pinterest: string
    linkedIn: string
}

export type OrderHistory = {
    id: string
    item: string
    status: string
    amount: number
    date: number
}

export type PaymentMethod = {
    cardHolderName: string
    cardType: string
    expMonth: string
    expYear: string
    last4Number: string
    primary: boolean
}

export type Subscription = {
    plan: string
    status: string
    billing: string
    nextPaymentDate: number
    amount: number
}

export type Customer = {
    id: string
    name: string
    email: string
    img: string
    role: string
    lastOnline: number
    status: string
    personalInfo: PersonalInfo
}

type GetCrmCustomerDetailsResponse = Customer & {
    orderHistory?: OrderHistory[]
    paymentMethod?: PaymentMethod[]
    subscription?: Subscription[]
}

type GetCrmCustomerDetailsRequest = { id: string }

// eslint-disable-next-line @typescript-eslint/ban-types
type DeleteCrmCustomerResponse = {}

type DeleteCrmCustomerRequest = { id: string }

export type CustomerDetailState = {
    loading: boolean
    profileData: Partial<Customer>
    subscriptionData: Subscription[]
    paymentHistoryData: OrderHistory[]
    paymentMethodData: PaymentMethod[]
    deletePaymentMethodDialog: boolean
    editPaymentMethodDialog: boolean
    editCustomerDetailDialog: boolean
    selectedCard: Partial<PaymentMethod>
}

export const getCustomer = createAsyncThunk(
    SLICE_NAME + '/getCustomer',
    async (data: GetCrmCustomerDetailsRequest) => {
        const response = await apiGetCrmCustomerDetails<
            GetCrmCustomerDetailsResponse,
            GetCrmCustomerDetailsRequest
        >(data)
        return response.data
    },
)

export const deleteCustomer = createAsyncThunk(
    SLICE_NAME + '/deleteCustomer',
    async (data: DeleteCrmCustomerRequest) => {
        const response = await apiDeleteCrmCustomer<
            DeleteCrmCustomerResponse,
            DeleteCrmCustomerRequest
        >(data)
        return response.data
    },
)

export const putCustomer = createAsyncThunk(
    SLICE_NAME + '/putCustomer',
    async (data: Customer) => {
        const response = await apPutCrmCustomer(data)
        return response.data
    },
)

const initialState: CustomerDetailState = {
    loading: true,
    profileData: {},
    subscriptionData: [],
    paymentHistoryData: [],
    paymentMethodData: [],
    deletePaymentMethodDialog: false,
    editPaymentMethodDialog: false,
    editCustomerDetailDialog: false,
    selectedCard: {},
}

const customerDetailSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updatePaymentMethodData: (state, action) => {
            state.paymentMethodData = action.payload
        },
        updateProfileData: (state, action) => {
            state.profileData = action.payload
        },
        openDeletePaymentMethodDialog: (state) => {
            state.deletePaymentMethodDialog = true
        },
        closeDeletePaymentMethodDialog: (state) => {
            state.deletePaymentMethodDialog = false
        },
        openEditPaymentMethodDialog: (state) => {
            state.editPaymentMethodDialog = true
        },
        closeEditPaymentMethodDialog: (state) => {
            state.editPaymentMethodDialog = false
        },
        openEditCustomerDetailDialog: (state) => {
            state.editCustomerDetailDialog = true
        },
        closeEditCustomerDetailDialog: (state) => {
            state.editCustomerDetailDialog = false
        },
        updateSelectedCard: (state, action) => {
            state.selectedCard = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCustomer.fulfilled, (state, action) => {
                state.loading = false
                state.profileData = action.payload
                state.subscriptionData = action.payload?.subscription || []
                state.paymentHistoryData = action.payload?.orderHistory || []
                state.paymentMethodData = action.payload?.paymentMethod || []
            })
            .addCase(getCustomer.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    updatePaymentMethodData,
    updateProfileData,
    openDeletePaymentMethodDialog,
    closeDeletePaymentMethodDialog,
    openEditPaymentMethodDialog,
    closeEditPaymentMethodDialog,
    openEditCustomerDetailDialog,
    closeEditCustomerDetailDialog,
    updateSelectedCard,
} = customerDetailSlice.actions

export default customerDetailSlice.reducer
