import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetCategorizedArticles } from '@/services/KnowledgeBaseService'

export type Article = {
    id: string
    title: string
    content: string
    category: string
    authors: {
        name: string
        img: string
    }[]
    starred: boolean
    updateTime: string
    createdBy: string
    timeToRead: number
    viewCount: number
}

export type CategorizedArticles = {
    label: string
    value: string
    articles: Article[]
}

type GetCategorizedArticles = CategorizedArticles[]

export type ManageArticleState = {
    loading: boolean
    categorizedArticles: CategorizedArticles[]
    articleDeleteConfirmation: boolean
    categoryDeleteConfirmation: boolean
    categoryRenameDialog: boolean
    categoryAddDialog: boolean
    selected: {
        id: string
        categoryValue: string
    }
}

export const SLICE_NAME = 'knowledgeBaseManageArticles'

export const getCategorizedArticles = createAsyncThunk(
    SLICE_NAME + '/getCategorizedArticles',
    async () => {
        const response =
            await apiGetCategorizedArticles<GetCategorizedArticles>()
        return response.data
    },
)

const initialState: ManageArticleState = {
    loading: false,
    categorizedArticles: [],
    articleDeleteConfirmation: false,
    categoryDeleteConfirmation: false,
    categoryRenameDialog: false,
    categoryAddDialog: false,
    selected: {
        id: '',
        categoryValue: '',
    },
}

const manageArticlesSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setCategorizedArticles: (state, action) => {
            state.categorizedArticles = action.payload
        },
        toggleArticleDeleteConfirmation: (state, action) => {
            state.articleDeleteConfirmation = action.payload
        },
        toggleCategoryDeleteConfirmation: (state, action) => {
            state.categoryDeleteConfirmation = action.payload
        },
        toggleCategoryRenameDialog: (state, action) => {
            state.categoryRenameDialog = action.payload
        },
        toggleAddCategoryDialog: (state, action) => {
            state.categoryAddDialog = action.payload
        },
        setSelected: (state, action) => {
            state.selected = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCategorizedArticles.fulfilled, (state, action) => {
                state.loading = false
                state.categorizedArticles = action.payload
            })
            .addCase(getCategorizedArticles.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    toggleArticleDeleteConfirmation,
    toggleCategoryDeleteConfirmation,
    toggleCategoryRenameDialog,
    toggleAddCategoryDialog,
    setSelected,
    setCategorizedArticles,
} = manageArticlesSlice.actions

export default manageArticlesSlice.reducer
