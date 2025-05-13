import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetAccountFormData } from '@/services/AccountServices'

export type PersonalInformation = {
    firstName: string
    lastName: string
    email: string
    residentCountry: string
    nationality: string
    dialCode: string
    phoneNumber: string
    dob: string
    gender: string
    maritalStatus: string
}

export type Identification = {
    documentType: string
    passportCover: string
    passportDataPage: string
    nationalIdFront: string
    nationalIdBack: string
    driversLicenseFront: string
    driversLicenseBack: string
}

export type Address = {
    country: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    zipCode: string
    sameCorrespondenceAddress: boolean
    correspondenceAddress?: {
        country: string
        addressLine1: string
        addressLine2: string
        city: string
        state: string
        zipCode: string
    }
}

type CompanyInformation = {
    companyName: string
    contactNumber: string
    country: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    zipCode: string
}

export type FinancialInformation = {
    taxResident: string
    tin: string
    noTin: boolean
    noTinReason: string | number
    occupation: string
    annualIncome: string
    sourceOfWealth: string
    companyInformation: CompanyInformation
}

type FormData = {
    personalInformation: PersonalInformation
    identification: Identification
    addressInformation: Address
    financialInformation: FinancialInformation
}

export type StepStatus = Record<number, { status: string }>

type GetAccountFormDataResponse = {
    formData: FormData
    formStatus: StepStatus
}

export type KycFormState = {
    formData: FormData
    stepStatus: StepStatus
    currentStep: number
}

export const SLICE_NAME = 'accountDetailForm'

export const getForm = createAsyncThunk(SLICE_NAME + '/getForm', async () => {
    const response = await apiGetAccountFormData<GetAccountFormDataResponse>()
    return response.data
})

export const initialState: KycFormState = {
    formData: {
        personalInformation: {
            firstName: '',
            lastName: '',
            email: '',
            residentCountry: '',
            nationality: '',
            dialCode: '',
            phoneNumber: '',
            dob: '',
            gender: '',
            maritalStatus: '',
        },
        identification: {
            documentType: 'passport',
            passportCover: '',
            passportDataPage: '',
            nationalIdFront: '',
            nationalIdBack: '',
            driversLicenseFront: '',
            driversLicenseBack: '',
        },
        addressInformation: {
            country: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipCode: '',
            sameCorrespondenceAddress: true,
            correspondenceAddress: {
                country: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                zipCode: '',
            },
        },
        financialInformation: {
            taxResident: '',
            tin: '',
            noTin: false,
            noTinReason: '',
            occupation: '',
            annualIncome: '',
            sourceOfWealth: '',
            companyInformation: {
                companyName: '',
                contactNumber: '',
                country: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                zipCode: '',
            },
        },
    },
    stepStatus: {
        0: { status: 'pending' },
        1: { status: 'pending' },
        2: { status: 'pending' },
        3: { status: 'pending' },
        4: { status: 'pending' },
    },
    currentStep: 0,
}

const kycFormSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setFormData: (state, action) => {
            state.formData = { ...state.formData, ...action.payload }
        },
        setStepStatus: (state, action) => {
            state.stepStatus = { ...state.stepStatus, ...action.payload }
        },
        setCurrentStep: (state, action) => {
            state.currentStep = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getForm.fulfilled, (state, action) => {
            state.formData = action.payload.formData
            state.stepStatus = action.payload.formStatus
        })
    },
})

export const { setFormData, setStepStatus, setCurrentStep } =
    kycFormSlice.actions

export default kycFormSlice.reducer
