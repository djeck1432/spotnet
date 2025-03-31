import { combineReducers } from '@reduxjs/toolkit'
import reducers, { SLICE_NAME, MailState } from './mailSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: MailState
        }
    }
> = useSelector

export * from './mailSlice'
export { useAppDispatch } from '@/store'
export default reducer
