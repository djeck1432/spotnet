import { combineReducers } from '@reduxjs/toolkit'
import reducers, { SLICE_NAME, ArticleState } from './articleSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: ArticleState
        }
    }
> = useSelector

export * from './articleSlice'
export { useAppDispatch } from '@/store'
export default reducer
