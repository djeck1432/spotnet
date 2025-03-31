import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetCategoriesData,
    apiQueryArticleList,
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

export type Category = {
    id: string
    name: string
    articleCounts: number
}

type GetCategoriesDataResponse = Category[]

type QueryArticleListRequest = { queryText: string; category: string }

type QueryArticleListResponse = Article[]

export type HelpCenterState = {
    loading: boolean
    isSearchResult: boolean
    searchCategory: string
    queryText: string
    categories: Category[]
    articles: Article[]
}

export const SLICE_NAME = 'knowledgeBaseHelpCenter'

export const getCategories = createAsyncThunk(
    SLICE_NAME + '/getCategories',
    async () => {
        const response = await apiGetCategoriesData<GetCategoriesDataResponse>()
        return response.data
    },
)

export const queryArticles = createAsyncThunk(
    SLICE_NAME + '/queryArticles',
    async (data: QueryArticleListRequest) => {
        const response = await apiQueryArticleList<
            QueryArticleListResponse,
            QueryArticleListRequest
        >(data)
        return response.data
    },
)

const initialState: HelpCenterState = {
    loading: false,
    isSearchResult: false,
    searchCategory: '',
    queryText: '',
    categories: [],
    articles: [],
}

const dataSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setSearchCategory: (state, action) => {
            state.searchCategory = action.payload
        },
        setQueryText: (state, action) => {
            state.queryText = action.payload
        },
        setSearch: (state, action) => {
            state.isSearchResult = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.fulfilled, (state, action) => {
                state.loading = false
                state.categories = action.payload
            })
            .addCase(getCategories.pending, (state) => {
                state.loading = true
            })
            .addCase(queryArticles.fulfilled, (state, action) => {
                state.loading = false
                state.articles = action.payload
            })
            .addCase(queryArticles.pending, (state) => {
                state.loading = true
            })
    },
})

export const { setSearchCategory, setQueryText, setSearch } = dataSlice.actions

export default dataSlice.reducer
