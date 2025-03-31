import { combineReducers } from '@reduxjs/toolkit'
import reducers, { SLICE_NAME, CrmDashboardState } from './crmDashboardSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: CrmDashboardState
        }
    }
> = useSelector

export * from './crmDashboardSlice'
export { useAppDispatch } from '@/store'
export default reducer
