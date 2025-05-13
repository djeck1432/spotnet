import { combineReducers } from '@reduxjs/toolkit'
import reducers, { SLICE_NAME, CustomersState } from './customersSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: CustomersState
        }
    }
> = useSelector

export * from './customersSlice'
export { useAppDispatch } from '@/store'
export default reducer
