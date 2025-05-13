import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetArticle } from '@/services/KnowledgeBaseService'

type Article = {
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

type GetArticleRequest = { id: string }

type GetArticleResponse = Article

export type EditArticleState = {
    loading: boolean
    article: Partial<Article>
    categoryValue: string
    categoryLabel: string
    mode: string
}

export const SLICE_NAME = 'knowledgeBaseEditArticle'

export const getArticle = createAsyncThunk(
    SLICE_NAME + '/getArticle',
    async (param: GetArticleRequest) => {
        const response = await apiGetArticle<
            GetArticleResponse,
            GetArticleRequest
        >(param)
        return response.data
    },
)

const initialState: EditArticleState = {
    loading: false,
    article: {},
    categoryValue: '',
    categoryLabel: '',
    mode: 'edit',
}

const editArticleSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setArticle: (state, action) => {
            state.article = action.payload
        },
        setCategory: (state, action) => {
            state.categoryValue = action.payload.categoryValue
            state.categoryLabel = action.payload.categoryLabel
        },
        setMode: (state, action) => {
            state.mode = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getArticle.fulfilled, (state, action) => {
                state.loading = false
                state.article = action.payload
            })
            .addCase(getArticle.pending, (state) => {
                state.loading = true
            })
    },
})

export const { setArticle, setCategory, setMode } = editArticleSlice.actions

export default editArticleSlice.reducer
