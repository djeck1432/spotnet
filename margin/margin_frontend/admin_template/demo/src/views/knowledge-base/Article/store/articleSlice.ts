import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetArticle,
    apiGetOthersArticleList,
} from '@/services/KnowledgeBaseService'

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

type GetArticleRespsonse = Article

type GetArticleRequest = { id: string }

type GetOthersArticleListResponse = {
    relatedArticle: Article[]
    popularArticle: Article[]
}

type GetOtherArticleRequest = { id: string }

export type ArticleState = {
    loading: boolean
    otherLoading: boolean
    article: Partial<Article>
    othersArticle: {
        relatedArticle: Article[]
        popularArticle: Article[]
    }
}

export const SLICE_NAME = 'knowledgeBaseArticle'

export const getArticle = createAsyncThunk(
    SLICE_NAME + '/getArticle',
    async (param: GetArticleRequest) => {
        const response = await apiGetArticle<
            GetArticleRespsonse,
            GetArticleRequest
        >(param)
        return response.data
    },
)

export const getOthersArticle = createAsyncThunk(
    SLICE_NAME + '/getOthersArticle',
    async (param: GetOtherArticleRequest) => {
        const response = await apiGetOthersArticleList<
            GetOthersArticleListResponse,
            GetOtherArticleRequest
        >(param)
        return response.data
    },
)

const initialState: ArticleState = {
    loading: false,
    otherLoading: false,
    article: {},
    othersArticle: {
        relatedArticle: [],
        popularArticle: [],
    },
}

const articleSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getArticle.fulfilled, (state, action) => {
                state.loading = false
                state.article = action.payload
            })
            .addCase(getArticle.pending, (state) => {
                state.loading = true
            })
            .addCase(getOthersArticle.fulfilled, (state, action) => {
                state.otherLoading = false
                state.othersArticle = action.payload
            })
            .addCase(getOthersArticle.pending, (state) => {
                state.otherLoading = true
            })
    },
})

export default articleSlice.reducer
